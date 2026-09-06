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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/google-sans" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased joseph `}
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
