export default function HeroIllustration() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[28%] mx-auto h-[min(520px,55vh)] max-w-6xl opacity-[0.55] sm:top-[32%]"
      aria-hidden
    >
      <svg
        viewBox="0 0 1200 600"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="iso-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Isometric facility blocks */}
        <g stroke="#cbd5e1" strokeWidth="1.2" fill="url(#iso-fade)">
          <path d="M420 380 L520 330 L620 380 L520 430 Z" fill="#f8fafc" />
          <path d="M520 330 L620 280 L720 330 L620 380 Z" fill="#f1f5f9" />
          <path d="M620 380 L720 330 L820 380 L720 430 Z" fill="#f8fafc" />
          <path d="M320 430 L420 380 L520 430 L420 480 Z" fill="#eef2f6" />
          <path d="M720 430 L820 380 L920 430 L820 480 Z" fill="#eef2f6" />
        </g>
        <g stroke="#94a3b8" strokeWidth="1" opacity="0.7">
          <path d="M180 420 L420 300 L660 420" />
          <path d="M300 480 L540 360 L780 480" />
          <path d="M540 360 L540 220" />
          <path d="M420 300 L420 160" />
          <path d="M660 420 L660 280" />
        </g>
        {/* Equipment nodes */}
        <circle cx="540" cy="220" r="6" fill="var(--color-primary-base)" fillOpacity="0.45" />
        <circle cx="420" cy="160" r="5" fill="#64748b" fillOpacity="0.4" />
        <circle cx="660" cy="280" r="5" fill="#64748b" fillOpacity="0.4" />
      </svg>

      {/* Floating spec pills (ZEUS-style) */}
      <div className="absolute top-[18%] left-[8%] rounded-full border border-stroke-soft-200 bg-bg-white-0/90 px-3 py-1.5 text-[10px] font-medium tracking-wide text-text-sub-600 shadow-regular-xs backdrop-blur sm:left-[14%] sm:text-xs">
        <span className="text-text-soft-400 uppercase">Asset</span>{" "}
        <span className="font-semibold text-text-strong-950">HVAC-0142</span>
      </div>
      <div className="absolute top-[8%] right-[6%] rounded-full border border-stroke-soft-200 bg-bg-white-0/90 px-3 py-1.5 text-[10px] font-medium tracking-wide text-text-sub-600 shadow-regular-xs backdrop-blur sm:right-[12%] sm:text-xs">
        <span className="text-text-soft-400 uppercase">PM due</span>{" "}
        <span className="font-semibold text-text-strong-950">72 hrs</span>
      </div>
      <div className="absolute bottom-[22%] left-[22%] rounded-full border border-stroke-soft-200 bg-bg-white-0/90 px-3 py-1.5 text-[10px] font-medium tracking-wide text-text-sub-600 shadow-regular-xs backdrop-blur sm:text-xs">
        <span className="text-text-soft-400 uppercase">Work order</span>{" "}
        <span className="font-semibold text-text-strong-950">WO-1842</span>
      </div>
    </div>
  );
}
