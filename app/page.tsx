 import FormSheet from "@/components/form-sheet";
import Image from "next/image";

export default function Home() {
  // const router =Router()
  return (

    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
       
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
         {/* <FormSheet/> */}
        <div className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <div className="mb-2 tracking-[-.01em]">
            Welcome to the MAINTENANCE CLONE  
          </div> 
        </div>

        {/* <div className="flex gap-4 items-center flex-col sm:flex-row"> */}
           
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center  justify-center">
          
        <a
          className="flex items-center justify-center gap-2 hover:underline hover:underline-offset-4"
          href="/dashboard"
          // target="_blank"
          // rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Enjoy →
        </a>
      </footer>
      </main>
    </div>
  );
}
