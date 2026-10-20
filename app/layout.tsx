import type { Metadata } from "next";
import { Libre_Franklin, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTransition } from "@/components/page-transition";
import { Reveal } from "@/components/reveal";

// A printed-report pairing: a heavy American gothic for headings and UI,
// a sober transitional serif for reading.
const heading = Libre_Franklin({
  variable: "--font-franklin",
  weight: ["500", "700", "800"],
  subsets: ["latin"],
});

const text = Source_Serif_4({
  variable: "--font-serif",
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
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
      className={`${heading.variable} ${text.variable} h-full antialiased`}
    >
      <body id="top" className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        <Reveal />
      </body>
    </html>
  );
}
