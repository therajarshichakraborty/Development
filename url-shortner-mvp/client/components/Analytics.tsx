import { useEffect } from "react";
import { GA_ADS_ID } from "../lib/googleAds";
import * as gtag from "../lib/gtag";

const Analytics = () => {
  useEffect(() => {
    if (gtag.GA_TRACKING_ID && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: any[]) {
        window.dataLayer.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", gtag.GA_TRACKING_ID, {
        page_path: window.location.pathname,
      });
    }

    if (GA_ADS_ID && typeof window !== "undefined") {
      const adsScript = document.createElement("script");
      adsScript.src = GA_ADS_ID;
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      document.head.appendChild(adsScript);
    }
  }, []);

  return null;
};

export default Analytics;
