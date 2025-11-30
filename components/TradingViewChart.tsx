"use client";

import { useEffect, useRef } from "react";

type Props = {
  symbol?: string; // np. "SP:SPX", "NASDAQ:IXIC"
};

export default function TradingViewChart({ symbol = "SP:SPX" }: Props) {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_legend: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      calendar: true,
      support_host: "https://www.tradingview.com",
    });

    container.current.innerHTML = "";
    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div className="mt-6 h-[420px] w-full overflow-hidden rounded-3xl bg-slate-900/60">
      <div className="tradingview-widget-container h-full" ref={container} />
    </div>
  );
}
