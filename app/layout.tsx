import type { Metadata, Viewport } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { CursorText } from "@/components/CursorText";
import { FadeIntersect } from "@/components/FadeIntersect";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "TIMOTHY BOUE",
  description: "Archive of photographic work by Timothy Boue.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={robotoCondensed.variable}>
      <body className="archives">
        <SiteHeader />
        <div className="main_content bg-white">{children}</div>
        <FadeIntersect>
          <SiteFooter />
        </FadeIntersect>
        <CursorText />
      </body>
    </html>
  );
}
