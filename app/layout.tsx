import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streaming Radio Online | Streamku",
  description: "Dengarkan stasiun radio favorit Anda di Streamku.",
  icons: {
    icon: "https://ik.imagekit.io/bfrfvbniv/stre%20amku.png",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script 
          src="https://pl29289620.profitablecpmratenetwork.com/a7/d6/a7/a7d6a70f49a059f3927fe5e3d4c73851.js" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}
