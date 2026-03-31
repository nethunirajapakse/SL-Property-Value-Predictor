import { BrowserRouter, Routes, Route } from "react-router-dom";
import Predictor from "./pages/Predictor";
import Landing from "./pages/Landing";

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
