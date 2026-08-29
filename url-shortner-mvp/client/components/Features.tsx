import {
  Zap,
  ShieldCheck,
  BarChart3,
  Database,
  Globe2,
  Cpu,
} from "lucide-react";
import config from "../config/index.json";

const iconMap: Record<string, React.ReactNode> = {
  "React.js": <Cpu className="w-6 h-6 text-primary" />,
  Tailwind: <Zap className="w-6 h-6 text-primary" />,
  "Next.js": <Globe2 className="w-6 h-6 text-primary" />,
  Typescript: <ShieldCheck className="w-6 h-6 text-primary" />,
  Analytics: <BarChart3 className="w-6 h-6 text-primary" />,
  Database: <Database className="w-6 h-6 text-primary" />,
};

const Features = () => {
  const { features } = config;
  const { title, subtitle, description, items: featuresList } = features;

  return (
    <section className="py-20 bg-gray-50/60" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-red-50 px-3 py-1 rounded-full">
            {title}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {subtitle}
          </h2>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {featuresList.map(feature => (
              <div
                key={feature.name}
                className="group relative p-8 bg-white rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 flex items-start gap-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all">
                  {iconMap[feature.name] || (
                    <Zap className="w-6 h-6 text-primary group-hover:text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
