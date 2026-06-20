import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Azba Fashion — Luxury Indian Ethnic Wear",
    template: "%s | Azba Fashion",
  },
  description:
    "Discover exquisite handcrafted Indian ethnic wear — lehengas, anarkalis, sarees, and kurtas crafted with centuries-old artisan precision.",
  keywords: [
    "Indian ethnic wear",
    "luxury lehenga",
    "bridal lehenga",
    "anarkali suit",
    "Banarasi saree",
    "designer kurta",
    "handcrafted ethnic wear",
    "Azba Fashion",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Azba Fashion",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#0a0806] text-[#f0e8dc] antialiased dark:bg-[#0a0806] dark:text-[#f0e8dc] light:bg-[#f8f4ef] light:text-[#1a1410]">
        {children}
      </body>
    </html>
  );
}
