import FeatureAnimation from "@/components/landing/feature-animation";

export default function Home() {
  // const router =Router()
  return (

    <div className="grid grid-rows-[20px_1fr_20px] bg-gradient-to-br from-[#cae7eeae] via-[#e3e8eead] to-[#ffffff]   items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* <FormSheet/> */}
        <div className="w-full flex justify-center">
          <FeatureAnimation />
        </div>

        {/* <div className="flex gap-4 items-center flex-col sm:flex-row"> */}

        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <a
            href="/dashboard"
            className="group relative inline-flex items-center gap-2 rounded-full bg-white/30 px-8 py-3 text-slate-900 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/50 hover:shadow-md hover:-translate-y-0.5 hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2 font-medium">
              This way to view our Progress
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
        </footer>
      </main>
    </div>
  );
}
