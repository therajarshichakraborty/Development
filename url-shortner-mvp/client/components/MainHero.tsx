import { useState } from "react";
import {
  Link2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ExternalLink,
  QrCode,
  Zap,
} from "lucide-react";
import config from "../config/index.json";

interface ShortenedLink {
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  createdAt: string;
  clicks: number;
}

const MainHero = () => {
  const { mainHero } = config;
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [recentLinks, setRecentLinks] = useState<ShortenedLink[]>([
    {
      originalUrl: "https://github.com/google-deepmind/antigravity",
      shortUrl: "https://sho.rt/agi2026",
      shortCode: "agi2026",
      createdAt: "Just now",
      clicks: 142,
    },
  ]);
  const [showQR, setShowQR] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    let formattedUrl = longUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try hitting local backend if running
      const res = await fetch("http://localhost:5000/api/v1/urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: formattedUrl,
          customAlias: customAlias.trim() || undefined,
        }),
      }).catch(() => null);

      let newLink: ShortenedLink;

      if (res && res.ok) {
        const data = await res.json();
        newLink = {
          originalUrl: formattedUrl,
          shortUrl: data.shortUrl || `http://localhost:5000/${data.shortCode}`,
          shortCode: data.shortCode,
          createdAt: "Just now",
          clicks: 0,
        };
      } else {
        // Instant simulated shortener for standalone client demo
        const randomCode =
          customAlias.trim() || Math.random().toString(36).substring(2, 8);
        newLink = {
          originalUrl: formattedUrl,
          shortUrl: `https://sho.rt/${randomCode}`,
          shortCode: randomCode,
          createdAt: "Just now",
          clicks: 0,
        };
      }

      setRecentLinks(prev => [newLink, ...prev.slice(0, 4)]);
      setLongUrl("");
      setCustomAlias("");
    } catch {
      setError("Failed to create shortened URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="mt-8 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-24">
      <div className="sm:text-center lg:text-left">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          High Performance URL Engine
        </div>

        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">{mainHero.title}</span>{" "}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
            {mainHero.subtitle}
          </span>
        </h1>
        <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed">
          {mainHero.description}
        </p>

        {/* Interactive URL Shortener Widget */}
        <div id="shorten" className="mt-8 max-w-2xl sm:mx-auto lg:mx-0">
          <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100 ring-1 ring-black/5">
            <form onSubmit={handleShorten} className="space-y-3">
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Link2 className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Paste your long link here (e.g. https://my-long-domain.com/article)..."
                  value={longUrl}
                  onChange={e => setLongUrl(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Custom alias (optional, e.g. launch2026)"
                  value={customAlias}
                  onChange={e => setCustomAlias(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-medium text-sm rounded-xl shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Shortening...
                    </span>
                  ) : (
                    <>
                      <span>Shorten Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

            {/* Results List */}
            {recentLinks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span>Recent Links</span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Zap className="w-3 h-3" /> Live
                  </span>
                </div>
                {recentLinks.map((link, idx) => (
                  <div
                    key={`${link.shortCode}-${idx}`}
                    className="p-3 bg-gray-50 hover:bg-gray-100/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-gray-200/60 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          {link.shortUrl}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 font-mono">
                          {link.clicks} clicks
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {link.originalUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => setShowQR(!showQR)}
                        title="Show QR Code"
                        className="p-2 text-gray-500 hover:text-gray-800 bg-white hover:bg-gray-200/60 rounded-lg border border-gray-200 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(link.shortUrl)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          copied
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feature stats */}
        <div className="mt-8 pt-6 flex flex-wrap items-center gap-6 sm:justify-center lg:justify-start text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>99.99% Uptime SLA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">&lt; 15ms</span>
            <span>O(1) Redirect Latency</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Non-blocking</span>
            <span>Async Analytics</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainHero;
