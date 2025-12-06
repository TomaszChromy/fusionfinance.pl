"use client";

export default function TopBanner() {
  return (
    <div className="relative bg-gradient-to-r from-[#1a1510] via-[#2a1f14] to-[#1a1510] border-b border-[#c9a962]/30">
      {/* Gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a962] to-transparent" />

      <div className="mx-auto max-w-[1400px] px-4 py-2.5 flex items-center justify-center gap-3">
        <span className="text-[#c9a962] text-base">🚧</span>

        <p className="text-xs sm:text-sm text-[#e4d4a5] text-center font-medium tracking-wide">
          <span className="text-[#c9a962] font-semibold">STRONA W BUDOWIE</span>
          <span className="hidden sm:inline text-[#a1a1aa]"> — Pracujemy nad nowymi funkcjami. Wkrótce więcej!</span>
        </p>

        <span className="text-[#c9a962] text-base">🚧</span>
      </div>
    </div>
  );
}

