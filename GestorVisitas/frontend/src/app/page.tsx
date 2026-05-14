"use client";

import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, CalendarClock, CheckCircle2, XCircle, Activity } from 'lucide-react';
import { mockRecentAccess, mockPendingRequests } from '@/lib/mockData';

export default function Dashboard() {
  const [liveAccess, setLiveAccess] = useState(mockRecentAccess);
  const [occupancy, setOccupancy] = useState(42);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: false}));
    const clock = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: false}));
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  // Simulate incoming scans
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const isEntry = Math.random() > 0.5;
        const newAccess = {
          id: Date.now(),
          visitor: isEntry ? 'Miguel Diaz' : 'Ana Silva',
          inmate: isEntry ? 'Roberto Diaz' : 'Carlos Mendoza',
          time: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', hour12: false}),
          type: isEntry ? 'entry' : 'exit',
          status: 'valid'
        };
        setLiveAccess(prev => [newAccess, ...prev].slice(0, 5));
        setOccupancy(prev => isEntry ? prev + 1 : Math.max(0, prev - 1));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-10 animate-in fade-in duration-700">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Command Center</h1>
            <p className="text-slate-400 mt-2 font-medium flex items-center gap-2 text-sm md:text-base">
              <Activity className="w-4 h-4 text-blue-500" /> Real-time facility monitoring
            </p>
          </div>
          <div className="text-left md:text-right">
             <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Local Time</p>
             <p className="text-xl md:text-2xl font-mono text-white mt-1">{timeStr}</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="rounded-3xl border border-white/10 bg-[#14171C]/80 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="rounded-2xl bg-blue-500/10 w-14 h-14 flex items-center justify-center mb-6 border border-blue-500/20">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Current Occupancy</p>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-5xl font-black text-white tracking-tighter">{occupancy}</p>
                <span className="text-sm font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-1 border border-blue-500/20">Active Visitors</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#14171C]/80 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <CalendarClock className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="rounded-2xl bg-emerald-500/10 w-14 h-14 flex items-center justify-center mb-6 border border-emerald-500/20">
                <CalendarClock className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Scheduled Today</p>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-5xl font-black text-white tracking-tighter">128</p>
                <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mb-1 border border-emerald-500/20">Approved</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-gradient-to-b from-[#1A1012]/90 to-[#14171C]/90 backdrop-blur-xl p-8 shadow-[0_0_40px_-10px_rgba(239,68,68,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-red-500">
              <ShieldAlert className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="rounded-2xl bg-red-500/10 w-14 h-14 flex items-center justify-center mb-6 border border-red-500/20">
                <ShieldAlert className="h-6 w-6 text-red-400" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Security Alerts</p>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-5xl font-black text-red-400 tracking-tighter">1</p>
                <span className="text-sm font-semibold text-red-400 bg-red-500/10 px-3 py-1 rounded-full mb-1 border border-red-500/20">Requires Attention</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Occupancy Visualizer */}
        <div className="mb-6 md:mb-10 rounded-3xl border border-white/10 bg-[#14171C]/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white">Sector Occupancy Analytics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm font-bold text-slate-300 uppercase tracking-wider block">Block A</span>
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">High Security</span>
                </div>
                <span className="text-sm font-mono text-white">45<span className="text-slate-500">/50</span></span>
              </div>
              <div className="h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.5)]" style={{width: '90%'}}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm font-bold text-slate-300 uppercase tracking-wider block">Block B</span>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">General Pop</span>
                </div>
                <span className="text-sm font-mono text-white">112<span className="text-slate-500">/150</span></span>
              </div>
              <div className="h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]" style={{width: '74%'}}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm font-bold text-slate-300 uppercase tracking-wider block">Block C</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Low Risk</span>
                </div>
                <span className="text-sm font-mono text-white">24<span className="text-slate-500">/100</span></span>
              </div>
              <div className="h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{width: '24%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Access Feed */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#14171C]/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
            <div className="border-b border-white/5 px-4 md:px-8 py-6 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-base md:text-lg font-bold text-white">Live Access Feed</h2>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-2 md:px-3 py-1.5 rounded-full border border-emerald-500/20">
                <span className="animate-pulse h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] md:text-xs font-bold text-emerald-400 tracking-wider uppercase">Live Stream</span>
              </div>
            </div>
            <div className="p-0 overflow-hidden flex-1 flex flex-col">
              <div className="w-full overflow-x-auto custom-scrollbar flex-1">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-[#181B21] sticky top-0 z-10">
                  <tr>
                    <th className="px-8 py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Time</th>
                    <th className="px-8 py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Visitor</th>
                    <th className="px-8 py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Inmate Target</th>
                    <th className="px-8 py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Event Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {liveAccess.map((access, idx) => (
                    <tr key={access.id} className={`transition-colors hover:bg-white/5 ${idx === 0 ? 'bg-blue-500/5' : ''}`}>
                      <td className="px-8 py-5 font-mono text-slate-400">{access.time}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          {access.status === 'valid' ? (
                            <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            </div>
                          ) : (
                            <div className="bg-red-500/10 p-1.5 rounded-lg border border-red-500/20">
                              <XCircle className="h-4 w-4 text-red-400" />
                            </div>
                          )}
                          <span className="font-semibold text-slate-200">{access.visitor}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-medium text-slate-400">{access.inmate}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
                          access.status !== 'valid' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          access.type === 'entry' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {access.status !== 'valid' ? 'Blocked' : access.type === 'entry' ? 'Entry' : 'Exit'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>

          {/* Security Alerts Timeline */}
          <div className="rounded-3xl border border-white/10 bg-[#14171C]/80 backdrop-blur-xl shadow-2xl flex flex-col h-[550px] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldAlert className="w-48 h-48 text-white" />
            </div>
             <div className="border-b border-white/5 px-6 md:px-8 py-6 bg-white/[0.02] relative z-10">
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                Security Timeline
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-black ml-2 tracking-widest">Live</span>
              </h2>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-6 custom-scrollbar relative z-10">
              {/* Timeline Item 1 */}
              <div className="relative pl-6 border-l border-red-500/30 group">
                <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[6.5px] top-1 shadow-[0_0_10px_rgba(239,68,68,0.8)] group-hover:scale-125 transition-transform"></div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-red-400 text-sm">Unauthorized Access Attempt</h3>
                  <span className="text-xs font-mono text-slate-500">10:42 AM</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">Block A - West Gate. Scanner detected invalid cryptographic signature on visitor pass.</p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold px-2 py-1 bg-red-500/10 text-red-400 rounded-md border border-red-500/20">High Priority</span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-white/5 text-slate-300 rounded-md border border-white/10">Camera 4</span>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative pl-6 border-l border-orange-500/30 group">
                <div className="absolute w-3 h-3 bg-orange-500 rounded-full -left-[6.5px] top-1 shadow-[0_0_10px_rgba(249,115,22,0.8)] group-hover:scale-125 transition-transform"></div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-orange-400 text-sm">Approaching Capacity</h3>
                  <span className="text-xs font-mono text-slate-500">09:15 AM</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">Block B general visitation area has reached 85% of maximum allowed occupancy.</p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold px-2 py-1 bg-orange-500/10 text-orange-400 rounded-md border border-orange-500/20">Warning</span>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative pl-6 border-l border-blue-500/30 group">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-1 shadow-[0_0_10px_rgba(59,130,246,0.8)] group-hover:scale-125 transition-transform"></div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-blue-400 text-sm">System Update</h3>
                  <span className="text-xs font-mono text-slate-500">08:00 AM</span>
                </div>
                <p className="text-xs text-slate-400">Main database synchronization completed successfully with National Registry.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
