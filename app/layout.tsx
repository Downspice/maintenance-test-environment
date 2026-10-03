import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { SheetProvider } from "@/lib/providers/sheet-providers";
import { DialogProvider } from "@/lib/providers/dialog-provider";
import { ConfirmDialogProvider } from "@/lib/shared/confirm-dialog";
import QueryProvider from "@/lib/api/query-provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAINTENANCE CLONE ",
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
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link href="https://fonts.cdnfonts.com/css/google-sans" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning
        className={`${geistMono.variable} font-sans antialiased joseph `}
      ><QueryProvider>
        <ConfirmDialogProvider>
          <SheetProvider>
            <DialogProvider>
              <NuqsAdapter>
                {children}
                <Toaster richColors />
              </NuqsAdapter>
            </DialogProvider>
          </SheetProvider>
        </ConfirmDialogProvider>
      </QueryProvider>
      </body>
    </html>
  );
}
