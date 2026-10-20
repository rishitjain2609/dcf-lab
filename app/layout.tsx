import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTransition } from "@/components/page-transition";
import { Reveal } from "@/components/reveal";

// One family does every job (display at 800, text at 400/600). The old mono
// and serif variables now resolve to it too, so legacy `font-mono` and
// `font-display` classes on not-yet-redesigned pages pick up the new face.
const sans = Schibsted_Grotesk({
  variable: "--font-body-sans",
  weight: ["400", "600", "800"],
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
      className={`${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
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
