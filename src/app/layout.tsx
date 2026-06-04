import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linternita Velas Artesanales",
  description: "Velas artesanales hechas con amor en México. Cera de soya, aromas naturales y diseños únicos.",
  keywords: "velas artesanales, velas de soya, velas aromáticas, México, regalo",
  openGraph: {
    title: "Linternita Velas Artesanales",
    description: "Velas artesanales hechas con amor en México.",
    siteName: "Linternita",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF7F2]">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
