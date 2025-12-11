"use client";

export default function TopBanner() {
  return (
    <div className="relative bg-gradient-to-r from-[#0f1419] via-[#1a1f26] to-[#0f1419] border-b border-[#58a6ff]/30">
      {/* Blue line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#58a6ff] to-transparent" />

      <div className="mx-auto max-w-[1400px] px-4 py-2.5 flex items-center justify-center gap-3">
        <span className="text-[#58a6ff] text-base">🚀</span>

        <p className="text-xs sm:text-sm text-[#e6edf3] text-center font-medium tracking-wide">
          <span className="text-[#58a6ff] font-semibold">WERSJA BETA</span>
          <span className="hidden sm:inline text-[#8b949e]"> — Aktywnie rozwijany projekt. Nowe funkcje dodawane regularnie!</span>
        </p>

        <span className="text-[#58a6ff] text-base">✨</span>
      </div>
    </div>
  );
}

