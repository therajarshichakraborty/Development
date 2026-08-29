import { Check, Zap, Sparkles } from "lucide-react";
import config from "../config/index.json";
import Divider from "./Divider";

const Pricing = () => {
  const { pricing } = config;
  const { items = [], title } = pricing;

  return (
    <section className="bg-white py-20" id="pricing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-red-50 px-3 py-1 rounded-full">
            Transparent Plans
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <Divider />
          <p className="text-gray-600 text-base sm:text-lg">
            Start for free, scale to billions of monthly redirections with zero
            downtime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {items.map((plan, idx) => {
            const isFeatured = idx === 1; // Middle plan (Pro) is highlighted
            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? "bg-white border-2 border-red-500 shadow-2xl shadow-red-500/10 lg:-translate-y-2 p-8 z-10"
                    : "bg-gray-50/70 border border-gray-200/80 shadow-sm p-8 hover:shadow-lg"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    {isFeatured && (
                      <span className="w-8 h-8 rounded-full bg-red-50 text-primary flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <div className="mt-4 mb-6">
                    <span className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-sm font-medium text-gray-500 ml-2">
                      / {plan.priceDetails}
                    </span>
                  </div>

                  <div className="w-full h-px bg-gray-200 mb-6" />

                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature: string) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-gray-700"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#shorten"
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-center text-sm transition-all duration-200 cursor-pointer block ${
                    isFeatured
                      ? "bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white shadow-lg shadow-red-500/25"
                      : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
                  }`}
                >
                  Get Started
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
