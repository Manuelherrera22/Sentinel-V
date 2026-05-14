"use client";

import React, { useState } from 'react';
import QrScanner from '@/components/QrScanner';
import { ShieldCheck, ShieldAlert, UserCheck, Fingerprint, ScanLine } from 'lucide-react';

import { saveScanOffline } from '@/lib/offlineStore';

export default function ScannerPage() {
  const [validationResult, setValidationResult] = useState<{valid: boolean, message: string, visitor?: any, isOffline?: boolean} | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  React.useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
  }, []);

  const mockValidVisitor = {
    name: 'Ana Silva',
    document: '12345678-9',
    inmate: 'Carlos Mendoza',
    relation: 'Spouse',
    photo: 'https://i.pravatar.cc/150?img=5'
  };

  const handleScanSuccess = async (token: string) => {
    setLoading(true);
    setValidationResult(null);

    // Save offline if no connection
    if (!navigator.onLine) {
      await saveScanOffline(token);
      setValidationResult({ 
        valid: true, 
        message: 'OFFLINE MODE: Pass saved locally. Will sync when connection returns.', 
        isOffline: true 
      });
      setLoading(false);
      return;
    }
    
    setTimeout(() => {
      if (token === 'demo-valid') {
        setValidationResult({ valid: true, message: 'Access Granted. Valid token verified.', visitor: mockValidVisitor });
      } else if (token === 'demo-invalid') {
        setValidationResult({ valid: false, message: 'CRITICAL: Token Expired or Reused.' });
      } else {
        setValidationResult({ valid: false, message: 'Unrecognized QR format.' });
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="p-4 md:p-10 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="mx-auto max-w-5xl w-full flex-1 flex flex-col">
        <header className="mb-6 md:mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4">
            <Fingerprint className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Security Checkpoint</h1>
          <p className="text-slate-400 mt-2 font-medium text-sm md:text-base">Scan visitor temporary pass for verification</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 flex-1">
          {/* Lado del Escáner */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 bg-[#14171C]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl relative">
              <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-3xl pointer-events-none"></div>
              <div className="relative z-10 h-full">
                <QrScanner onScanSuccess={handleScanSuccess} />
              </div>
            </div>
            
            {/* Controles de Demo */}
            <div className="bg-[#14171C]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span> Developer Tools
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => handleScanSuccess('demo-valid')}
                  className="flex-1 bg-white/5 border border-white/10 text-slate-300 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-300 transition-all text-sm py-3 rounded-xl font-bold tracking-wide cursor-pointer"
                >
                  Simulate Valid QR
                </button>
                <button 
                  onClick={() => handleScanSuccess('demo-invalid')}
                  className="flex-1 bg-white/5 border border-white/10 text-slate-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all text-sm py-3 rounded-xl font-bold tracking-wide cursor-pointer"
                >
                  Simulate Invalid QR
                </button>
              </div>
            </div>
          </div>

          {/* Lado de Resultados */}
          <div className="flex flex-col h-full">
            {loading ? (
              <div className="rounded-3xl bg-[#14171C]/80 backdrop-blur-xl p-10 shadow-2xl border border-blue-500/30 h-full flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-3xl"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Decrypting Payload</h3>
                  <p className="mt-2 text-blue-400 font-mono text-sm">Verifying cryptographic signature...</p>
                </div>
              </div>
            ) : validationResult ? (
              <div className={`rounded-3xl p-10 shadow-2xl border h-full flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500 relative overflow-hidden ${validationResult.valid ? 'bg-gradient-to-b from-[#14171C]/90 to-emerald-950/40 border-emerald-500/30 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]' : 'bg-gradient-to-b from-[#14171C]/90 to-red-950/40 border-red-500/30 shadow-[0_0_50px_-12px_rgba(239,68,68,0.2)]'}`}>
                
                {validationResult.valid ? (
                  <div className="bg-emerald-500/20 p-4 rounded-full mb-6 border border-emerald-500/30">
                    <ShieldCheck className="h-16 w-16 text-emerald-400" />
                  </div>
                ) : (
                  <div className="bg-red-500/20 p-4 rounded-full mb-6 border border-red-500/30">
                    <ShieldAlert className="h-16 w-16 text-red-400" />
                  </div>
                )}
                
                <h3 className={`text-3xl font-black tracking-tight ${validationResult.valid ? 'text-emerald-400' : 'text-red-400'}`}>
                  {validationResult.valid ? 'AUTHORIZATION GRANTED' : 'ACCESS DENIED'}
                </h3>
                <p className={`mt-3 font-mono text-sm px-4 py-1.5 rounded-md ${validationResult.valid ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                  {validationResult.message}
                </p>

                {validationResult.valid && validationResult.visitor && (
                  <div className="mt-8 w-full bg-black/40 rounded-2xl p-4 md:p-6 text-left border border-white/10 relative overflow-hidden backdrop-blur-md">
                    <div className="absolute -right-4 -bottom-4 opacity-5">
                      <UserCheck className="w-48 h-48 text-white" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-6 relative z-10 text-center md:text-left">
                      <img src={validationResult.visitor.photo} alt="Visitor" className="w-20 h-20 rounded-full border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] object-cover" />
                      <div>
                        <p className="text-xl md:text-2xl font-bold text-white tracking-tight">{validationResult.visitor.name}</p>
                        <p className="text-xs md:text-sm font-mono text-emerald-400 mt-1">ID: {validationResult.visitor.document}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5 relative z-10">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Inmate</p>
                        <p className="text-white font-semibold">{validationResult.visitor.inmate}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Relationship</p>
                        <p className="text-white font-semibold">{validationResult.visitor.relation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl bg-[#14171C]/50 backdrop-blur-xl p-10 shadow-2xl border border-white/5 h-full flex flex-col justify-center items-center text-center border-dashed">
                <ScanLine className="mb-6 h-20 w-20 text-slate-700 animate-pulse" />
                <h3 className="text-xl font-bold text-slate-400">Awaiting Scan</h3>
                <p className="text-slate-500 mt-2 font-medium max-w-[250px]">Position the visitor's QR code in front of the camera.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
