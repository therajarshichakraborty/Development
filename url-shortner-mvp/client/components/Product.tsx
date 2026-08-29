import { Shield, Sparkles, Layers, Activity } from "lucide-react";
import config from "../config/index.json";
import Divider from "./Divider";

const Product = () => {
  const { product } = config;
  const items = product.items || [];

  return (
    <section className="bg-white py-16" id="product">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-red-50 px-3 py-1 rounded-full">
            Engineered For Scale
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {product.title}
          </h2>
          <Divider />
        </div>

        <div className="space-y-16">
          {items.map((item, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <div
                key={item.title}
                className={`flex flex-col ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-10 lg:gap-16`}
              >
                {/* Text Content */}
                <div className="flex-1 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-primary shadow-sm">
                    {index === 0 ? (
                      <Layers className="w-6 h-6" />
                    ) : (
                      <Activity className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    {item.description}
                  </p>
                  <div className="pt-2 flex items-center gap-4 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>Zero Overhead</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Stateless Security</span>
                    </div>
                  </div>
                </div>

                {/* Graphic Card */}
                <div className="flex-1 w-full">
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-red-50/30 border border-gray-200/80 shadow-lg">
                    <div className="space-y-4 font-mono text-xs text-gray-600">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <span className="font-sans font-bold text-sm text-gray-900">
                          {index === 0
                            ? "O(1) Route Resolution"
                            : "Clickstream Ingestion Pipeline"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          OPTIMIZED
                        </span>
                      </div>
                      <div className="bg-gray-900 text-emerald-400 p-4 rounded-xl overflow-x-auto">
                        <code>
                          {index === 0
                            ? `// Fast O(1) in-memory index\nconst url = await db.urls.findOne({ shortCode: "agi2026" });\nres.redirect(302, url.originalUrl);`
                            : `// Non-blocking async event queue\nawait analyticsQueue.publish({\n  shortCode: "agi2026",\n  referrer: "twitter.com",\n  timestamp: Date.now()\n});`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Product;
