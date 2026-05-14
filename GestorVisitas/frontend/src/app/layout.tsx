import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { LayoutDashboard, Users, ScanLine, Shield } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

import Providers from './providers';

export const metadata: Metadata = {
  title: "Sentinel - Visit Management",
  description: "Comprehensive Visit Management System",
  manifest: "/manifest.json",
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0A0A0B] text-slate-200 flex h-screen overflow-hidden selection:bg-blue-500/30`}>
        <Providers>
        {/* Sidebar */}
        <aside className="w-72 bg-[#0F1115] border-r border-white/5 flex flex-col relative overflow-hidden">
          {/* Subtle glow effect behind logo */}
          <div className="absolute top-0 left-0 w-full h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="p-8 border-b border-white/5 relative z-10">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter">SENTINEL<span className="text-blue-500">.</span></h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">Penitentiary System</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-6 space-y-2 relative z-10">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4 ml-2">Main Menu</p>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
              <LayoutDashboard className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              <span className="font-medium">Command Center</span>
            </Link>
            <Link href="/inmates" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
              <Users className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              <span className="font-medium">Inmate Whitelist</span>
            </Link>
            <Link href="/scanner" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
              <ScanLine className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              <span className="font-medium">Access Scanner</span>
            </Link>
          </nav>
          
          <div className="p-6 relative z-10">
            <div className="bg-gradient-to-br from-blue-500/10 to-transparent p-4 rounded-2xl border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-400">System Online</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Connected to secure network</p>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
          {/* Main background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
        </Providers>
      </body>
    </html>
  );
}
