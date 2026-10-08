import type { Metadata } from "next";
import { Work_Sans, Fragment_Mono, Petrona } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeScript } from "@/components/theme-script";
import { PageTransition } from "@/components/page-transition";

const bodySans = Work_Sans({
  variable: "--font-body-sans",
  subsets: ["latin"],
});

const bodyMono = Fragment_Mono({
  variable: "--font-body-mono",
  weight: "400",
  subsets: ["latin"],
});

const displaySerif = Petrona({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "DCF Lab",
  description:
    "Why DCFs get the price wrong even when the math is right. An educational site on discounted cash flow valuation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodySans.variable} ${bodyMono.variable} ${displaySerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
