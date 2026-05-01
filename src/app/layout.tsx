import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import FloatingElements from "@/components/FloatingElements";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rocket Matka - Live Results",
  description: "Fastest autonomous Matka Results platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-matka-bg text-matka-text pb-24`}>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
        <FloatingElements />
      </body>
    </html>
  );
}
