import Header from "../components/Header";
import MainHero from "../components/MainHero";
import MainHeroImage from "../components/MainHeroImage";
import Canvas from "../components/Canvas";
import LazyShow from "../components/LazyShow";
import Product from "../components/Product";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import About from "../components/About";
import Analytics from "../components/Analytics";

const App = () => {
  return (
    <div className="bg-white min-h-screen text-gray-900 selection:bg-red-500 selection:text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-red-50/40 via-white to-white overflow-hidden pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-20 pb-8 bg-transparent sm:pb-12 md:pb-16 lg:max-w-2xl lg:w-full">
            <Header />
            <MainHero />
          </div>
        </div>
        <MainHeroImage />
      </div>

      {/* Decorative dynamic wave */}
      <Canvas />

      {/* Product Section */}
      <LazyShow>
        <Product />
      </LazyShow>

      {/* Wave transition */}
      <Canvas />

      {/* Features Section */}
      <LazyShow>
        <Features />
      </LazyShow>

      {/* Pricing Section */}
      <LazyShow>
        <Pricing />
      </LazyShow>

      {/* About / Footer Section */}
      <LazyShow>
        <About />
      </LazyShow>

      {/* Google Analytics Integration */}
      <Analytics />
    </div>
  );
};

export default App;
