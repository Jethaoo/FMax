import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/MobileNav";

const titillium = Titillium_Web({ 
  weight: ["200", "300", "400", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "F1 Viewer",
  description: "View Formula 1 2025 Schedule and Standings",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${titillium.className} bg-gray-50`}>
        <div className="min-h-screen flex flex-col pb-16 md:pb-0">
          <header className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider">F1 Viewer</h1>
              <nav className="hidden md:flex space-x-6 font-semibold">
                <a href="/" className="hover:text-gray-200 transition-colors">Home</a>
                <a href="/drivers" className="hover:text-gray-200 transition-colors">Drivers</a>
                <a href="/constructors" className="hover:text-gray-200 transition-colors">Constructors</a>
              </nav>
            </div>
          </header>
          <main className="flex-grow container mx-auto p-4 md:p-6">
            {children}
          </main>
          <footer className="hidden md:block bg-gray-900 text-white p-6 mt-auto">
            <div className="container mx-auto text-center text-sm text-gray-400">
              <p>&copy; 2026 F1 Viewer. Data provided by OpenF1 API.</p>
            </div>
          </footer>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
