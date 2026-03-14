import type { Metadata } from "next";

import { Lora, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BraSpa - Post-Cancer Bra Sharing",
  description:
    "A local community where breast cancer survivors share bras they no longer need.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${inter.variable} font-sans min-h-screen bg-linen-50`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-linen-200 mt-16 py-8 text-center text-sm text-stone-500">
            <p>BraSpa &mdash; Sharing comfort, building community</p>
            <p className="mt-2"><a href="mailto:braspadmin@gmail.com" className="text-rose-600 hover:underline">Contact us</a></p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
