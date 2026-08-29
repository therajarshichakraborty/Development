import { Globe, BarChart3, ShieldCheck, Zap } from "lucide-react";

const MainHeroImage = () => {
  return (
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
      <div className="relative w-full max-w-lg">
        {/* Background glow effects */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-red-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Card UI Mockup */}
        <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-2xl p-6 space-y-6">
          {/* Header of the mock dashboard */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-primary">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Live Traffic Analytics
                </h4>
                <p className="text-xs text-gray-500">
                  Real-time clickstream data
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Active
            </span>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 font-medium">
                Total Redirections
              </div>
              <div className="text-2xl font-black text-gray-900 mt-1">
                284,910
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                ↑ 24.5% this week
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 font-medium">
                Avg Latency
              </div>
              <div className="text-2xl font-black text-primary mt-1">
                11.4 ms
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Global edge routing
              </div>
            </div>
          </div>

          {/* Visual Sparkline Bars */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Traffic Distribution</span>
              <span className="font-medium text-gray-700">
                Top Geo: US, DE, IN, UK
              </span>
            </div>
            <div className="h-16 w-full flex items-end gap-1.5 bg-gray-50 p-2 rounded-xl border border-gray-100">
              {[40, 65, 30, 85, 55, 95, 75, 90, 60, 100, 80, 70, 92].map(
                (height, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${height}%` }}
                    className="flex-1 bg-gradient-to-t from-red-500 to-rose-400 rounded-t-sm opacity-90 hover:opacity-100 transition-opacity"
                  />
                )
              )}
            </div>
          </div>

          {/* Feature highlights */}
          <div className="flex items-center justify-between pt-2 text-xs text-gray-600 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>Geo IP Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>DDOS Protected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Sub-15ms Redirect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeroImage;
