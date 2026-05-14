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
    <div className="p-10 animate-in fade-in duration-700">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Command Center</h1>
            <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Real-time facility monitoring
            </p>
          </div>
          <div className="text-right">
             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Local Time</p>
             <p className="text-2xl font-mono text-white mt-1">{timeStr}</p>
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

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Access Feed */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#14171C]/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
            <div className="border-b border-white/5 px-8 py-6 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-lg font-bold text-white">Live Access Feed</h2>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <span className="animate-pulse h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Live Stream</span>
              </div>
            </div>
            <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm">
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

          {/* Pending Approvals */}
          <div className="rounded-3xl border border-white/10 bg-[#14171C]/80 backdrop-blur-xl shadow-2xl flex flex-col h-[550px]">
             <div className="border-b border-white/5 px-8 py-6 bg-white/[0.02]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Pending Approvals
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded-full text-xs ml-2">2</span>
              </h2>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              {mockPendingRequests.map(req => (
                <div key={req.id} className="border border-white/10 bg-white/[0.02] rounded-2xl p-5 hover:border-blue-500/30 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-200 text-lg">{req.visitorName}</h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{req.date}</span>
                  </div>
                  <div className="text-sm text-slate-400 mb-5 space-y-1">
                    <p>Target: <strong className="text-slate-200">{req.targetInmate}</strong></p>
                    <p>Relation: <span className="text-slate-300">{req.relation}</span></p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-2 text-sm font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/20">
                      Approve
                    </button>
                    <button className="flex-1 rounded-xl bg-red-500/10 border border-red-500/20 py-2 text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/0 hover:shadow-red-500/20">
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
