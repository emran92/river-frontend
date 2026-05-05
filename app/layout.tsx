import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import FeatureBar from "@/components/home/FeatureBar";
import Providers from "@/components/Providers";

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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background antialiased" suppressHydrationWarning>
        <Providers>
          <Header />
          <Navigation />
          <main className="flex-1">{children}</main>
          <FeatureBar />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
