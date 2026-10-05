import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { SheetProvider } from "@/lib/providers/sheet-providers";
import { DialogProvider } from "@/lib/providers/dialog-provider";
import { ConfirmDialogProvider } from "@/lib/shared/confirm-dialog";
import QueryProvider from "@/lib/api/query-provider";
import { ThemeProvider } from "@/lib/providers/theme-provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAINTENANCE CLONE ",
  description: "test-maintenance-erp.vercel.app",
  icons: {
    icon: [{ url: "/brand-logo.png", type: "image/png" }],
    apple: [{ url: "/brand-logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link href="https://fonts.cdnfonts.com/css/google-sans" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning
        className={`${geistMono.variable} font-sans antialiased joseph `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
