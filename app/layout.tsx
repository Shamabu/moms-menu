import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mom's Menu | What's for Dinner?",
  description: "Quick meal ideas to take the stress out of daily dinner decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.className} bg-amber-50/50 min-h-screen text-gray-900`}>
        {children}
      </body>
    </html>
  );
}