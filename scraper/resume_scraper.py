"""
resume_scraper.py
==================
Resumes scraping from where it left off.
Reads listing_urls.txt, skips already-scraped URLs in raw_properties.csv,
and scrapes only the remaining ones.

Run with:
    python resume_scraper.py
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

# ── LOGGING ────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("resume_scraper.log", encoding="utf-8"),
        logging.StreamHandler()
    ]
)
log = logging.getLogger(__name__)

OUTPUT_FILE    = "raw_properties.csv"
URL_FILE       = "listing_urls.txt"
CHECKPOINT     = 25
LISTING_DELAY  = (1, 2)
COOLDOWN_EVERY = 300

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
    "kelaniya": "Gampaha", "peliyagoda": "Gampaha",
    "kalutara": "Kalutara", "panadura": "Kalutara", "beruwala": "Kalutara",
    "aluthgama": "Kalutara", "bandaragama": "Kalutara", "horana": "Kalutara",
    "ingiriya": "Kalutara", "matugama": "Kalutara",
    "kandy": "Kandy", "peradeniya": "Kandy", "katugastota": "Kandy",
    "kundasale": "Kandy", "ampitiya": "Kandy", "digana": "Kandy",
    "galle": "Galle", "hikkaduwa": "Galle", "unawatuna": "Galle",
    "ambalangoda": "Galle", "elpitiya": "Galle", "bentota": "Galle",
    "matara": "Matara", "weligama": "Matara", "mirissa": "Matara",
    "dickwella": "Matara", "tangalle": "Matara",
    "kurunegala": "Kurunegala", "kuliyapitiya": "Kurunegala",
    "anuradhapura": "Anuradhapura", "trincomalee": "Trincomalee",
    "jaffna": "Jaffna", "batticaloa": "Batticaloa",
    "ratnapura": "Ratnapura", "badulla": "Badulla",
}


def build_driver():
    opts = Options()
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
    if not raw:
        return None
    s = str(raw).replace(",", "")
    nums = re.findall(r"[\d]+(?:\.[\d]+)?", s)
    return float(nums[0]) if nums else None


def clean_land_size(raw):
    if not raw:
        return None
    s = str(raw).lower()
    num = extract_numeric(raw)
    if num is None:
        return None
    if "acre" in s:
        return round(num * 40, 4)
    if "sq" in s or "sqft" in s or "square" in s:
        return round(num / 272.25, 4)
    if "hectare" in s:
        return round(num * 395.37, 4)
    return num


def extract_storeys(raw_storeys, title):
    if raw_storeys:
        n = extract_numeric(raw_storeys)
        if n:
            return int(n)
    t = str(title).lower()
    if any(x in t for x in ["single story", "single storey", "1 story", "1 storey"]):
        return 1
    if any(x in t for x in ["two story", "two storey", "2 story", "double story", "2 storey"]):
        return 2
    if any(x in t for x in ["three story", "three storey", "3 story", "3 storey"]):
        return 3
    if any(x in t for x in ["four story", "4 story", "4 storey"]):
        return 4
    return None


def extract_district(location, url=""):
    loc_lower = location.lower().strip()
    url_lower = url.lower()
    for d in DISTRICTS:
        if loc_lower == d.lower() or loc_lower.startswith(d.lower()):
            return d
    for area, district in AREA_TO_DISTRICT.items():
        if area in loc_lower:
            return district
    for d in DISTRICTS:
        if f"-{d.lower()}" in url_lower or f"/{d.lower()}" in url_lower:
            return d
    return "Other"


def get_description(soup):
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
    return max(candidates, key=len)[:800] if candidates else ""


def scrape_listing(driver, url, property_type):
    try:
        driver.get(url)
        WebDriverWait(driver, 12).until(
            EC.presence_of_element_located((By.TAG_NAME, "h1"))
        )
        time.sleep(random.uniform(*LISTING_DELAY))
        soup = BeautifulSoup(driver.page_source, "html.parser")

        h1 = soup.find("h1")
        title = h1.get_text(strip=True) if h1 else ""

        price_el = soup.select_one("span.price--3SnqI") or soup.select_one("[class*='price']")
        price_raw = price_el.get_text(strip=True) if price_el else ""
        if not price_raw:
            m = re.search(r"Rs\.?\s*[\d,]+(?:\.\d+)?", soup.get_text())
            price_raw = m.group(0).strip() if m else ""

        loc_el = (soup.select_one("span.town--3UEQE")
                  or soup.select_one("[class*='location']")
                  or soup.select_one("[class*='town']"))
        loc_raw = loc_el.get_text(strip=True) if loc_el else ""
        location = loc_raw.strip().rstrip(",").strip()

        attrs = parse_attributes(soup)
        price_val, is_neg = clean_price(price_raw)
        land_val  = clean_land_size(attrs.get("land_size_raw", ""))
        floor_val = extract_numeric(attrs.get("floor_area_raw", ""))
        beds      = extract_numeric(attrs.get("bedrooms", ""))
        baths     = extract_numeric(attrs.get("bathrooms", ""))
        storeys   = extract_storeys(attrs.get("storeys_raw", ""), title)
        district  = extract_district(location, url)
        desc      = get_description(soup)

        log.info(
            f"  ✓ {title[:45]:<45} | Rs {str(price_val):>12} | "
            f"beds={beds} baths={baths} land={land_val}p"
        )

        return {
            "url": url, "property_type": property_type,
            "scraped_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "title": title, "description": desc,
            "price_lkr": price_val, "negotiable": int(is_neg),
            "location": location, "district": district, "area": location,
            "bedrooms": beds, "bathrooms": baths,
            "land_size_p": land_val, "floor_area_sqft": floor_val,
            "storeys": storeys, "furnishing": attrs.get("furnishing", ""),
        }
    except Exception as e:
        log.error(f"  ✗ {url} — {e}")
        return None


def save(records):
    pd.DataFrame(records).to_csv(OUTPUT_FILE, index=False, encoding="utf-8-sig")
    log.info(f"  💾 Saved {len(records)} records → {OUTPUT_FILE}")


# ── MAIN ───────────────────────────────────────────────────────
def main():
    log.info("=" * 60)
    log.info("  RESUME SCRAPER — picking up where we left off")
    log.info("=" * 60)

    # Load all URLs
    with open(URL_FILE, encoding="utf-8") as f:
        lines = [l.strip() for l in f if l.strip()]

    all_urls = []
    for line in lines:
        parts = line.split("\t")
        url   = parts[0].strip()
        ptype = parts[1].strip() if len(parts) > 1 else "houses"
        all_urls.append((url, ptype))

    log.info(f"Total URLs in file: {len(all_urls)}")

    # Load already scraped
    try:
        done_df   = pd.read_csv(OUTPUT_FILE)
        done_urls = set(done_df["url"].tolist())
        records   = done_df.to_dict("records")
        log.info(f"Already scraped:    {len(done_urls)}")
    except FileNotFoundError:
        done_urls = set()
        records   = []
        log.info("No existing CSV — starting fresh")

    # Filter remaining
    remaining = [(u, p) for u, p in all_urls if u not in done_urls]
    log.info(f"Remaining to scrape: {len(remaining)}")
    log.info(f"Estimated time: ~{len(remaining) * 3 // 60} hours {len(remaining) * 3 % 60} mins\n")

    if not remaining:
        log.info("Nothing left! You're done.")
        return

    driver = build_driver()
    try:
        for i, (url, ptype) in enumerate(remaining, 1):
            log.info(f"[{i}/{len(remaining)}]")
            rec = scrape_listing(driver, url, ptype)
            if rec:
                records.append(rec)
            if i % CHECKPOINT == 0:
                save(records)
            if i % COOLDOWN_EVERY == 0:
                pause = random.uniform(15, 25)
                log.info(f"  😴 Cooling down {pause:.0f}s...")
                time.sleep(pause)

    except KeyboardInterrupt:
        log.info("\n⚠️  Interrupted — saving progress...")
    finally:
        driver.quit()
        save(records)
        log.info(f"\n✅ Done! Total records: {len(records)}")


if __name__ == "__main__":
    main()
