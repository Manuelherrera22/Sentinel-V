"use client";

import React, { useState } from 'react';
import { mockInmates, mockVisitors } from '@/lib/mockData';
import { Search, ShieldAlert, CheckCircle2, MoreVertical, Shield, FileText } from 'lucide-react';

export default function InmatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');

  const filteredInmates = mockInmates.filter(inmate => {
    const matchesSearch = inmate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inmate.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'All' || inmate.securityLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-10 animate-in fade-in duration-700">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Inmate Whitelist</h1>
            <p className="text-slate-400 mt-2 font-medium flex items-center gap-2 text-sm md:text-base">
              <FileText className="w-4 h-4 text-blue-500" /> Authorized visitor management
            </p>
          </div>
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search ID or name..." 
              className="pl-12 pr-4 py-3 bg-[#14171C]/80 backdrop-blur-md border border-white/10 rounded-xl w-full md:w-80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Filters */}
        <div className="flex gap-3 mb-6 md:mb-8 overflow-x-auto pb-2 custom-scrollbar">
          <button onClick={() => setFilterLevel('All')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filterLevel === 'All' ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>All Inmates</button>
          <button onClick={() => setFilterLevel('High')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${filterLevel === 'High' ? 'bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-red-500/5 text-red-400 border-red-500/20 hover:bg-red-500/20'}`}><Shield className="w-4 h-4"/> High Risk</button>
          <button onClick={() => setFilterLevel('Medium')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${filterLevel === 'Medium' ? 'bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-orange-500/5 text-orange-400 border-orange-500/20 hover:bg-orange-500/20'}`}><Shield className="w-4 h-4"/> Medium Risk</button>
          <button onClick={() => setFilterLevel('Low')} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${filterLevel === 'Low' ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'}`}><Shield className="w-4 h-4"/> Low Risk</button>
        </div>

        <div className="grid gap-6">
          {filteredInmates.map(inmate => {
            const allowedVisitors = inmate.visitors.map(vId => mockVisitors.find(v => v.id === vId)).filter(Boolean);
            
            return (
              <div key={inmate.id} className="bg-[#14171C]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden group">
                <div className="bg-white/[0.02] border-b border-white/5 px-8 py-6 flex justify-between items-center transition-colors group-hover:bg-white/[0.04]">
                  <div className="flex items-center gap-5">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl h-14 w-14 flex items-center justify-center font-black text-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                      {inmate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">{inmate.name}</h2>
                      <div className="flex gap-3 text-sm text-slate-400 mt-1.5 font-medium items-center">
                        <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-xs border border-white/10">{inmate.id}</span>
                        <span>•</span>
                        <span>{inmate.block}</span>
                        <span>•</span>
                        <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${inmate.securityLevel === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : inmate.securityLevel === 'Medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                          <Shield className="w-3 h-3" />
                          {inmate.securityLevel} Security
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5">Authorized Visitors</h3>
                  
                  {allowedVisitors.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {allowedVisitors.map(visitor => visitor && (
                        <div key={visitor.id} className="flex items-center gap-4 border border-white/10 bg-white/[0.01] p-4 rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-default">
                          <img src={visitor.photo} alt={visitor.name} className="w-12 h-12 rounded-full object-cover border border-white/20" />
                          <div>
                            <p className="font-bold text-slate-200">{visitor.name}</p>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">{visitor.relation} • <span className="font-mono">{visitor.document}</span></p>
                          </div>
                          <div className="ml-auto">
                            <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-400 bg-white/[0.02] p-5 rounded-2xl border border-dashed border-white/10">
                      <ShieldAlert className="w-5 h-5 text-slate-500" />
                      <span className="font-medium">No authorized visitors in whitelist.</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
