import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DownloadDen – Download Any Video, Anywhere",
  description: "All-in-one social media video downloader.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="w-full text-center py-8 mt-16 flex flex-col items-center gap-2 glass-card dark:glass-card-dark border-t border-white/10 dark:border-white/10">
          <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-gray-300">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/dmca" className="hover:underline">DMCA & Copyright</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/disclaimer" className="hover:underline">Platform Disclaimer</Link>
          </div>
          <div className="text-xs text-gray-500 mt-2">&copy; {new Date().getFullYear()} DownloadDen. All rights reserved.</div>
        </footer>
      </body>
    </html>
  );
}
