function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold tracking-wide">Estate Vision</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl transition">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">
        <h2 className="text-5xl font-extrabold leading-tight max-w-3xl">
          AI-Powered Property Value Prediction for Sri Lanka
        </h2>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl">
          Get accurate real estate price predictions using advanced machine
          learning models trained on Sri Lankan property data.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-2xl text-lg font-semibold transition">
            Predict Now
          </button>
          <button className="border border-gray-400 hover:bg-white hover:text-black px-8 py-3 rounded-2xl text-lg transition">
            Learn More
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-32 px-8 pb-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Accurate Predictions</h3>
          <p className="text-gray-300">
            Uses advanced ML algorithms like XGBoost to provide reliable
            property valuations.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Location Intelligence</h3>
          <p className="text-gray-300">
            Considers district, amenities, and market trends for precise
            valuation.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Data-Driven Insights</h3>
          <p className="text-gray-300">
            Visual analytics and smart metrics to understand real estate
            patterns in Sri Lanka.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
