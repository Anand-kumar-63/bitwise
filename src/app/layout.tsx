import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "react-hot-toast";

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
    default: "Taania Kandpal — Luxury Indian Ethnic Wear",
    template: "%s | Taania Kandpal",
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
    "Taania Kandpal",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Taania Kandpal",
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
      <body className="min-h-screen flex flex-col bg-[#0a0806] text-[#f0e8dc] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
