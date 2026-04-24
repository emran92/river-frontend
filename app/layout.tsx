import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import FeatureBar from "@/components/home/FeatureBar";

export const metadata: Metadata = {
  title: "River Electronics — Premium Home Appliances in Bangladesh",
  description:
    "River Electronics offers a wide range of premium home appliances — TVs, refrigerators, ACs, washing machines and more. Shop now with free shipping and 14-day returns.",
  keywords: "home appliances, electronics, Bangladesh, BDT, River Electronics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50 antialiased">
        <Header />
        <Navigation />
        <main className="flex-1">{children}</main>
        <FeatureBar />
        <Footer />
      </body>
    </html>
  );
}
