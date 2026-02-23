import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import Predictor from "./pages/Predictor";

function Landing() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/predict" element={<Predictor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
