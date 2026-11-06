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

const App = async () => {
  return (
    <div className="bg-white min-h-screen text-gray-900 selection:bg-red-500 selection:text-white">
      <div className="relative bg-linear-to-b from-red-50/40 via-white to-white overflow-hidden pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-20 pb-8 bg-transparent sm:pb-12 md:pb-16 lg:max-w-2xl lg:w-full">
            <Header />
            <MainHero />
          </div>
        </div>
        <MainHeroImage />
      </div>
      <Canvas />
      <LazyShow>
      <Product />
      </LazyShow>
      <Canvas />
      <LazyShow>
        <Features />
      </LazyShow>
      <LazyShow>
      <Pricing />
      </LazyShow>
      <LazyShow>
      <About />
      </LazyShow>
      <Analytics />
    </div>
  );
};

export default App;
