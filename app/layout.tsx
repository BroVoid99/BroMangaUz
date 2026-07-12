import type { Metadata } from "next";
import { Bebas_Neue, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas"
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bromanga.vercel.app"),
  title: {
    default: "BroManga — BroVoid asarlarini onlayn o'qing",
    template: "%s | BroManga"
  },
  description:
    "BroVoid tomonidan yaratilgan original manga va manhwa asarlarini bepul onlayn o'qing: Zero Awakening, Frozen Woods, Valemort Merosi.",
  keywords: ["manga", "manhwa", "BroVoid", "o'zbek manga", "onlayn o'qish"],
  openGraph: {
    title: "BroManga",
    description: "BroVoid asarlarini onlayn o'qing",
    type: "website",
    locale: "uz_UZ"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${bebas.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <body className="bg-ink text-parchment font-body antialiased selection:bg-gold selection:text-ink">
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
