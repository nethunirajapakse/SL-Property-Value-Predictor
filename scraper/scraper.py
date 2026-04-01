"""
scraper.py  —  ikman.lk Property Scraper  (Final Version)
===========================================================
Scrapes houses, land, and apartments from ikman.lk Sri Lanka.
All fields are clean and numeric where appropriate.

Run with:
    python scraper.py

Outputs:
    listing_urls.txt     — all collected URLs  (safe to resume from)
    raw_properties.csv   — clean scraped data  (checkpointed every 25)
    scraper.log          — full log
"""

import time, random, re, logging
from datetime import datetime

import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("scraper.log", encoding="utf-8"),
        logging.StreamHandler()
    ]
)
log = logging.getLogger(__name__)

CONFIG = {
    "categories": [
        ("houses",     "https://ikman.lk/en/ads/sri-lanka/houses-for-sale"),
        ("land",       "https://ikman.lk/en/ads/sri-lanka/land-for-sale"),
        ("apartments", "https://ikman.lk/en/ads/sri-lanka/apartments-for-sale"),
    ],
    "max_pages_per_category": 40,
    "page_delay":     (3, 5),
    "listing_delay": (2, 4),
    "output_file":   "raw_properties.csv",
    "url_file":      "listing_urls.txt",
    "checkpoint_every": 25,
    "headless": True,
}

ATTR_ALIASES = {
    "bedrooms": "bedrooms", "bedroom": "bedrooms", "beds": "bedrooms",
    "no. of bedrooms": "bedrooms", "number of bedrooms": "bedrooms",
    "bathrooms": "bathrooms", "bathroom": "bathrooms", "baths": "bathrooms",
    "no. of bathrooms": "bathrooms",
    "house size": "floor_area_raw", "floor area": "floor_area_raw",
    "living area": "floor_area_raw", "built-up area": "floor_area_raw",
    "house area": "floor_area_raw", "home size": "floor_area_raw",
    "land size": "land_size_raw", "land area": "land_size_raw",
    "plot size": "land_size_raw", "lot size": "land_size_raw",
    "extent": "land_size_raw",
    "storeys": "storeys_raw", "floors": "storeys_raw",
    "no. of floors": "storeys_raw", "stories": "storeys_raw",
    "furnishing": "furnishing",
}

def build_driver():
    opts = Options()
    if CONFIG["headless"]:
        opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-blink-features=AutomationControlled")
    opts.add_experimental_option("excludeSwitches", ["enable-automation"])
    opts.add_experimental_option("useAutomationExtension", False)
    opts.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    opts.add_argument("--window-size=1920,1080")
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=opts
    )
    driver.execute_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )
    return driver

def parse_attributes(soup):
    attrs = {}

    for el in soup.find_all(string=re.compile(r".+:\s*$")):
        label = el.strip().rstrip(":").strip().lower()
        std_key = ATTR_ALIASES.get(label)
        if not std_key:
            continue
        parent = el.parent
        if parent:
            nxt = parent.find_next_sibling()
            if nxt:
                val = nxt.get_text(strip=True)
                if val:
                    attrs[std_key] = val
                    continue
            full_text = parent.get_text(separator="|", strip=True)
            parts = full_text.split("|")
            for i, part in enumerate(parts):
                if label in part.lower() and i + 1 < len(parts):
                    attrs[std_key] = parts[i + 1].strip()
                    break

    page_text = soup.get_text(separator="\n")
    for raw_label, std_key in ATTR_ALIASES.items():
        if std_key in attrs:
            continue
        pattern = re.compile(
            rf"{re.escape(raw_label)}\s*[:\-]\s*([^\n\r,|]+)", re.IGNORECASE
        )
        match = pattern.search(page_text)
        if match:
            val = match.group(1).strip()
            if val and len(val) < 50:
                attrs[std_key] = val

    return attrs

def clean_price(raw):
    """
    'Rs 92,500,000'           → (92500000.0, False)
    'Rs 65,000,000Negotiable' → (65000000.0, True)
    'Rs 15.5 Mn'              → (15500000.0, False)
    """
    if not raw:
        return None, False
    s = str(raw).replace(",", "")
    negotiable = bool(re.search(r"negotiable", s, re.I))
    s = re.sub(r"negotiable", "", s, flags=re.I).strip()

    mn = re.search(r"([\d.]+)\s*[Mm](?:n|illion)?", s)
    if mn:
        return float(mn.group(1)) * 1_000_000, negotiable

    nums = re.findall(r"[\d]+(?:\.[\d]+)?", s)
    if nums:
        val = float(nums[0])
        return (val if val > 10000 else val * 1_000_000), negotiable

    return None, negotiable

def extract_numeric(raw):
    """'4,500.0 sqft' → 4500.0  |  '10.6 perches' → 10.6  |  '4' → 4.0"""
    if not raw:
        return None
    s = str(raw).replace(",", "")
    nums = re.findall(r"[\d]+(?:\.[\d]+)?", s)
    return float(nums[0]) if nums else None

def clean_land_size(raw):
    """
    Returns (value_in_perches, unit_string)
    '10.6 perches' → (10.6, 'perches')
    '2722.5 sqft'  → (10.0, 'perches')   ← converted
    '0.25 acres'   → (10.0, 'perches')   ← converted
    """
    if not raw:
        return None, None
    s = str(raw).lower()
    num = extract_numeric(raw)
    if num is None:
        return None, None

    if "acre" in s:
        return round(num * 40, 4), "perches"
    if "sq" in s or "sqft" in s or "square" in s:
        return round(num / 272.25, 4), "perches"
    if "hectare" in s:
        return round(num * 395.37, 4), "perches"
    return num, "perches"

def extract_storeys(raw_storeys, title):
    if raw_storeys:
        n = extract_numeric(raw_storeys)
        if n:
            return int(n)

    title_lower = str(title).lower()
    if "single story" in title_lower or "single storey" in title_lower or "1 story" in title_lower:
        return 1
    if "two story" in title_lower or "two storey" in title_lower or "2 story" in title_lower or "double story" in title_lower:
        return 2
    if "three story" in title_lower or "three storey" in title_lower or "3 story" in title_lower:
        return 3
    if "four story" in title_lower or "4 story" in title_lower:
        return 4
    return None

def clean_location(raw):
    """'Piliyandala,' → 'Piliyandala'"""
    return str(raw).strip().rstrip(",").strip() if raw else ""

DISTRICTS = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale",
    "Nuwara Eliya", "Galle", "Matara", "Hambantota",
    "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu",
    "Batticaloa", "Ampara", "Trincomalee", "Kurunegala",
    "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
    "Monaragala", "Ratnapura", "Kegalle", "Negombo",
]

AREA_TO_DISTRICT = {
    "piliyandala": "Colombo", "kalubowila": "Colombo", "dematagoda": "Colombo",
    "dehiwala": "Colombo", "maharagama": "Colombo", "nugegoda": "Colombo",
    "boralesgamuwa": "Colombo", "kesbewa": "Colombo", "athurugiriya": "Colombo",
    "malabe": "Colombo", "kottawa": "Colombo", "battaramulla": "Colombo",
    "rajagiriya": "Colombo", "nawala": "Colombo", "kohuwala": "Colombo",
    "mount lavinia": "Colombo", "moratuwa": "Colombo", "kaduwela": "Colombo",
    "mulleriyawa": "Colombo", "thalawathugoda": "Colombo", "hokandara": "Colombo",
    "padukka": "Colombo", "homagama": "Colombo", "hanwella": "Colombo",
    "colombo 1": "Colombo", "colombo 2": "Colombo", "colombo 3": "Colombo",
    "colombo 4": "Colombo", "colombo 5": "Colombo", "colombo 6": "Colombo",
    "colombo 7": "Colombo", "colombo 8": "Colombo", "colombo 9": "Colombo",
    "colombo 10": "Colombo", "colombo 11": "Colombo", "colombo 12": "Colombo",
    "colombo 13": "Colombo", "colombo 14": "Colombo", "colombo 15": "Colombo",
    "negombo": "Gampaha", "wattala": "Gampaha", "ja-ela": "Gampaha",
    "seeduwa": "Gampaha", "kandana": "Gampaha", "ragama": "Gampaha",
    "gampaha": "Gampaha", "veyangoda": "Gampaha", "nittambuwa": "Gampaha",
    "minuwangoda": "Gampaha", "mirigama": "Gampaha", "divulapitiya": "Gampaha",
    "katana": "Gampaha", "kelaniya": "Gampaha", "peliyagoda": "Gampaha",
    "kalutara": "Kalutara", "panadura": "Kalutara", "beruwala": "Kalutara",
    "aluthgama": "Kalutara", "bandaragama": "Kalutara", "horana": "Kalutara",
    "ingiriya": "Kalutara", "matugama": "Kalutara",
    "kandy": "Kandy", "peradeniya": "Kandy", "katugastota": "Kandy",
    "kundasale": "Kandy", "ampitiya": "Kandy", "digana": "Kandy",
    "galle": "Galle", "hikkaduwa": "Galle", "unawatuna": "Galle",
    "ambalangoda": "Galle", "elpitiya": "Galle", "bentota": "Galle",
    "matara": "Matara", "weligama": "Matara", "mirissa": "Matara",
    "dickwella": "Matara", "tangalle": "Matara",
}

def extract_district_from_location(location, url=""):
    """
    Extract district using location string and URL — much more reliable
    than breadcrumbs since ikman puts district in the URL slug.

    URL example: .../houses-for-sale-colombo  → district = Colombo
    Location: 'Piliyandala' → area_to_district → Colombo
    """
    loc_lower = location.lower().strip()
    url_lower = url.lower()

    for d in DISTRICTS:
        if loc_lower == d.lower() or loc_lower.startswith(d.lower()):
            return d, location

    for area, district in AREA_TO_DISTRICT.items():
        if area in loc_lower:
            return district, location

    for d in DISTRICTS:
        if f"-{d.lower()}" in url_lower or f"/{d.lower()}" in url_lower:
            return d, location

    return "Other", location

def get_description(soup):
    """
    Get the actual property description — avoid nav/footer text.
    ikman puts the description in a div with class containing 'description'.
    """
    for sel in ["div.description--2-ez3", "[class*='description--']", "[class*='_description']"]:
        el = soup.select_one(sel)
        if el:
            text = el.get_text(separator=" ", strip=True)
            if len(text) > 30:
                return text[:800]

    candidates = []
    for tag in soup.find_all(["p", "div"]):
        parents = [p.name for p in tag.parents]
        if any(x in parents for x in ["nav", "header", "footer", "aside"]):
            continue
        text = tag.get_text(separator=" ", strip=True)
        if 50 < len(text) < 2000:
            candidates.append(text)

    if candidates:
        return max(candidates, key=len)[:800]

    return ""

def collect_urls(driver, base_url, category_name, max_pages):
    urls = []
    for page in range(1, max_pages + 1):
        try:
            driver.get(f"{base_url}?page={page}")
            time.sleep(random.uniform(*CONFIG["page_delay"]))
            soup = BeautifulSoup(driver.page_source, "html.parser")

            page_urls = set()
            for a in soup.select("a[href*='/ad/']"):
                href = a.get("href", "")
                if "/ad/" in href:
                    full = ("https://ikman.lk" + href if href.startswith("/") else href)
                    page_urls.add(full.split("?")[0])

            if not page_urls:
                log.info(f"  [{category_name}] Page {page}: empty — stopping.")
                break

            urls.extend(list(page_urls))
            log.info(f"  [{category_name}] Page {page}/{max_pages}: "
                     f"{len(page_urls)} listings  (total: {len(set(urls))})")
        except Exception as e:
            log.error(f"  [{category_name}] Page {page} failed: {e}")
    return list(set(urls))

def scrape_listing(driver, url, property_type):
    try:
        driver.get(url)
        WebDriverWait(driver, 12).until(
            EC.presence_of_element_located((By.TAG_NAME, "h1"))
        )
        time.sleep(random.uniform(*CONFIG["listing_delay"]))
        soup = BeautifulSoup(driver.page_source, "html.parser")

        h1       = soup.find("h1")
        title    = h1.get_text(strip=True) if h1 else ""

        price_el = soup.select_one("span.price--3SnqI") or soup.select_one("[class*='price']")
        price_raw = price_el.get_text(strip=True) if price_el else ""
        if not price_raw:
            m = re.search(r"Rs\.?\s*[\d,]+(?:\.\d+)?", soup.get_text())
            price_raw = m.group(0).strip() if m else ""

        loc_el   = (soup.select_one("span.town--3UEQE")
                    or soup.select_one("[class*='location']")
                    or soup.select_one("[class*='town']"))
        loc_raw  = loc_el.get_text(strip=True) if loc_el else ""

        attrs    = parse_attributes(soup)

        price_val, is_negotiable = clean_price(price_raw)
        land_val, _              = clean_land_size(attrs.get("land_size_raw", ""))
        floor_val                = extract_numeric(attrs.get("floor_area_raw", ""))
        beds                     = extract_numeric(attrs.get("bedrooms", ""))
        baths                    = extract_numeric(attrs.get("bathrooms", ""))
        storeys                  = extract_storeys(attrs.get("storeys_raw", ""), title)
        location                 = clean_location(loc_raw)
        district, area           = extract_district_from_location(location, url)
        description              = get_description(soup)

        data = {
            "url":             url,
            "property_type":   property_type,
            "scraped_at":      datetime.now().strftime("%Y-%m-%d %H:%M"),
            "title":           title,
            "description":     description,
            "price_lkr":       price_val,
            "negotiable":      int(is_negotiable),
            "location":        location,
            "district":        district,
            "area":            area,
            "bedrooms":        beds,
            "bathrooms":       baths,
            "land_size_p":     land_val,
            "floor_area_sqft": floor_val,
            "storeys":         storeys,
            "furnishing":      attrs.get("furnishing", ""),
        }

        log.info(
            f"  ✓ {title[:45]:<45} | Rs {str(price_val):>12} | "
            f"beds={beds} baths={baths} land={land_val}p floor={floor_val}sqft"
        )
        return data

    except Exception as e:
        log.error(f"  ✗ {url} — {e}")
        return None

def save_checkpoint(records, filepath):
    if not records:
        return
    pd.DataFrame(records).to_csv(filepath, index=False, encoding="utf-8-sig")
    log.info(f"  💾 Checkpoint: {len(records)} records → {filepath}")

def main():
    log.info("=" * 65)
    log.info("  ikman.lk Property Scraper — Final Version")
    log.info("=" * 65)

    driver   = build_driver()
    all_urls = []
    records  = []

    try:
        log.info("\n📋 PHASE 1: Collecting URLs...")
        for cat_name, cat_url in CONFIG["categories"]:
            log.info(f"\n  Category: {cat_name}")
            urls = collect_urls(driver, cat_url, cat_name, CONFIG["max_pages_per_category"])
            for u in urls:
                all_urls.append((u, cat_name))
            log.info(f"  → {len(urls)} unique URLs")

        seen, deduped = set(), []
        for url, ptype in all_urls:
            if url not in seen:
                seen.add(url)
                deduped.append((url, ptype))
        all_urls = deduped
        log.info(f"\n✅ Total unique listings: {len(all_urls)}")

        with open(CONFIG["url_file"], "w", encoding="utf-8") as f:
            for url, ptype in all_urls:
                f.write(f"{url}\t{ptype}\n")

        log.info("\n🔍 PHASE 2: Scraping listings...")
        for i, (url, ptype) in enumerate(all_urls, 1):
            log.info(f"\n  [{i}/{len(all_urls)}]")
            rec = scrape_listing(driver, url, ptype)
            if rec:
                records.append(rec)
            if i % CONFIG["checkpoint_every"] == 0:
                save_checkpoint(records, CONFIG["output_file"])
            if i % 150 == 0:
                pause = random.uniform(15, 25)
                log.info(f"  😴 Cool-down {pause:.0f}s...")
                time.sleep(pause)

    except KeyboardInterrupt:
        log.info("\n⚠️  Interrupted — saving...")
    finally:
        driver.quit()
        save_checkpoint(records, CONFIG["output_file"])
        log.info(f"\n🎉 Done! {len(records)} listings → {CONFIG['output_file']}")

if __name__ == "__main__":
    main()
