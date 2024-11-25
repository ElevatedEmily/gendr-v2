import type { Metadata } from "next";
//import localFont from "next/font/local";
import "./globals.css";
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import ClientSessionProvider from "@/components/ClientSessionProvider";


export const metadata: Metadata = {
  title: "Gendr",
  description: "The best genderqueer dating app!",
};


const inter = Inter({
  subsets: ['latin'], // Include character subsets you need
  weight: ['400', '600', '700'], // Choose specific font weights
  display: 'swap', // Fallback behavior for loading
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-pink-200 via-blue-100 to-white">
        <ClientSessionProvider> {/* Wrap in Client Component */}
          <Header />
          <main className="pt-16">{children}</main>
        </ClientSessionProvider>
      </body>
    </html>
  );
}