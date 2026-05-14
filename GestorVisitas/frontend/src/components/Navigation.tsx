"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ScanLine, Shield, Menu, X } from 'lucide-react';

export default function Navigation({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Mobile TopBar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#0F1115] border-b border-white/5 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-black text-white tracking-tighter">SENTINEL</h2>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#0F1115] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="absolute top-0 left-0 w-full h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="p-8 border-b border-white/5 relative z-10 hidden md:block">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter">SENTINEL<span className="text-blue-500">.</span></h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1 font-semibold">Penitentiary System</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 relative z-10 mt-16 md:mt-0 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4 ml-2">Main Menu</p>
          <Link href="/" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${pathname === '/' ? 'bg-blue-500/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard className={`w-5 h-5 transition-colors ${pathname === '/' ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
            <span className="font-medium">Command Center</span>
          </Link>
          <Link href="/inmates" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${pathname === '/inmates' ? 'bg-blue-500/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Users className={`w-5 h-5 transition-colors ${pathname === '/inmates' ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
            <span className="font-medium">Inmate Whitelist</span>
          </Link>
          <Link href="/scanner" onClick={closeMenu} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${pathname === '/scanner' ? 'bg-blue-500/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <ScanLine className={`w-5 h-5 transition-colors ${pathname === '/scanner' ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
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
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed w-full pt-16 md:pt-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
