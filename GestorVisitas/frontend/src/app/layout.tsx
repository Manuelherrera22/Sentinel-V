import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { LayoutDashboard, Users, ScanLine, Shield } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

import Providers from './providers';
import Navigation from '@/components/Navigation';

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
      <body className={`${inter.className} bg-[#0A0A0B] text-slate-200 selection:bg-blue-500/30`}>
        <Providers>
          <Navigation>
            {children}
          </Navigation>
        </Providers>
      </body>
    </html>
  );
}
