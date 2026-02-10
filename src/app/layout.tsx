import type { Metadata, Viewport } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";

const titillium = Titillium_Web({ 
  weight: ["200", "300", "400", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "F1 Viewer",
  description: "View Formula 1 2025 Schedule and Standings",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏎️</text></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${titillium.className} bg-[#15151E] antialiased`}>
        <div className="min-h-screen flex flex-col pb-16 md:pb-0">
          <header className="bg-red-600/95 text-white p-4 shadow-md sticky top-0 z-40 border-b border-red-500/40 backdrop-blur-sm">
            <div className="container max-w-6xl mx-auto flex justify-between items-center">
              <Link href="/" className="text-xl md:text-2xl font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                F1 Viewer
              </Link>
              <nav className="hidden md:flex items-center gap-2 font-semibold text-sm">
                <Link href="/" className="px-3 py-1.5 rounded-md hover:bg-white/15 transition-colors">Home</Link>
                <Link href="/drivers" className="px-3 py-1.5 rounded-md hover:bg-white/15 transition-colors">Drivers</Link>
                <Link href="/constructors" className="px-3 py-1.5 rounded-md hover:bg-white/15 transition-colors">Constructors</Link>
                <Link href="/schedule" className="px-3 py-1.5 rounded-md hover:bg-white/15 transition-colors">Schedule</Link>
              </nav>
            </div>
          </header>
          <main className="flex-grow container max-w-6xl mx-auto p-4 md:p-6">
            {children}
          </main>
          <footer className="hidden md:block bg-[#101018] border-t border-white/10 text-white p-6 mt-auto">
            <div className="container max-w-6xl mx-auto text-center text-sm text-gray-400">
              <p>&copy; 2026 F1 Viewer. Data provided by OpenF1 API.</p>
            </div>
          </footer>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
