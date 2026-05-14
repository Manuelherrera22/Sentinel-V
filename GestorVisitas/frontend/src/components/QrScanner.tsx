"use client";

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, CheckCircle2 } from 'lucide-react';

interface QrScannerProps {
  onScanSuccess: (token: string) => void;
}

export default function QrScanner({ onScanSuccess }: QrScannerProps) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(true);

  useEffect(() => {
    if (!scannerActive) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        setScannerActive(false);
        scanner.clear();
        onScanSuccess(decodedText);
      },
      (error) => {
        // Ignorar errores de escaneo temporal (cuando no hay QR en foco)
      }
    );

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
    };
  }, [scannerActive, onScanSuccess]);

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-[#0A0A0B] shadow-2xl border border-white/10">
        <div className="bg-[#181B21] border-b border-white/5 p-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/20 blur-2xl rounded-full pointer-events-none"></div>
          <Camera className="mx-auto mb-3 h-8 w-8 text-blue-400 relative z-10" />
          <h2 className="text-xl font-black tracking-tight relative z-10">Access Scanner</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium relative z-10">Position QR code inside the frame</p>
        </div>
        
        {scannerActive ? (
          <div className="p-4 bg-black">
            <div id="reader" className="overflow-hidden rounded-2xl border border-white/10"></div>
          </div>
        ) : (
          <div className="p-10 text-center bg-[#0A0A0B]">
            {scanResult ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
                <p className="text-xl font-bold text-white tracking-tight">Code Captured</p>
                <p className="mt-3 text-[10px] font-mono text-slate-500 break-all bg-white/5 p-3 rounded-xl border border-white/5">{scanResult}</p>
                <button 
                  onClick={() => { setScanResult(null); setScannerActive(true); }}
                  className="mt-8 rounded-xl bg-blue-600 hover:bg-blue-500 w-full py-3.5 font-bold text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
                >
                  Scan Another Pass
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
