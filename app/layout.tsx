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
  title: "FoodReview ID",
  description: "Platform komunitas untuk berbagi pengalaman kuliner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="light"
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col text-zinc-800 selection:bg-zinc-200 selection:text-zinc-900"
        suppressHydrationWarning
      >
        {/* Sticky Minimalist Navbar */}
        <header className="sticky top-0 z-50 w-full glass-card border-x-0 border-t-0 border-b border-zinc-200/40 bg-white/75 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex-1">
                <Link href="/" className="group flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white font-black text-sm group-hover:scale-105 transition-transform duration-200">
                    FR
                  </span>
                  FoodReview<span className="text-zinc-400 font-normal">.id</span>
                </Link>
              </div>
              <div className="flex-none gap-4">
                <Link 
                  href="/restaurants/new" 
                  className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-850 active:scale-95 transition-all duration-150 shadow-sm"
                >
                  Tambah Restoran
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Container with spacing constraints */}
        <div className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>

        {/* Minimalist Footer */}
        <footer className="w-full border-t border-zinc-200/50 bg-white py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
            <p>© {new Date().getFullYear()} FoodReview ID. UAS Pemrograman Web 2.</p>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-zinc-650 transition-colors">Beranda</Link>
              <Link href="/restaurants/new" className="hover:text-zinc-650 transition-colors">Tambah Tempat</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

