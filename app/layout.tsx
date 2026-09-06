import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { SheetProvider } from "@/lib/providers/sheet-providers";
import { DialogProvider } from "@/lib/providers/dialog-provider";
import QueryProvider from "@/lib/api/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAINTENANCE CLONE | ",
  description: "test-maintenance-erp.vercel.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased joseph `}
      ><QueryProvider>
        <SheetProvider>
          <DialogProvider>
            <NuqsAdapter>
              {children}
              <Toaster richColors/>
            </NuqsAdapter>
          </DialogProvider>
        </SheetProvider></QueryProvider>
      </body>
    </html>
  );
}
