import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Advert from "@/components/advert";
import Footer from "@/components/footer";
import Header from "@/components/header";

const roboto = Roboto({
  weight: ["100", "200", "400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Buy Homeopathic Remedies Online - Homeo South",
  description: "Onlie Homeopathic remedies for all your ailments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <Advert />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
