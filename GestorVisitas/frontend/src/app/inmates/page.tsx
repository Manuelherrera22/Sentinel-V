"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, ShieldAlert, CheckCircle2, MoreVertical, Shield, FileText, Calendar, Clock, Key, Scale, Gavel, User, Fingerprint, Loader2, PhoneCall } from 'lucide-react';
import { checkEligibility } from '@/lib/schedule';

export default function InmatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [inmates, setInmates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInmates() {
      const { data, error } = await supabase
        .from('inmates')
        .select(`
          *,
          inmate_visitors (
            relationship,
            visitors (*)
          )
        `);
      
      if (error) {
        console.error('Error fetching inmates:', error);
      } else {
        setInmates(data || []);
      }
      setLoading(false);
    }
    fetchInmates();
  }, []);

  const filteredInmates = inmates.filter(inmate => {
    const fullName = `${inmate.first_name} ${inmate.last_name}`.toLowerCase();
    const inmateNum = inmate.inmate_number.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          inmateNum.includes(searchTerm.toLowerCase());
    // In DB, security level might be capitalized or lowercase, let's normalize
    const matchesFilter = filterLevel === 'All' || 
                          inmate.security_level.toLowerCase() === filterLevel.toLowerCase();
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#14171C]/50 rounded-3xl border border-white/5">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Loading inmates database...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredInmates.map(inmate => {
              const fullName = `${inmate.first_name} ${inmate.last_name}`;
              const initials = `${inmate.first_name?.[0] || ''}${inmate.last_name?.[0] || ''}`;
              const relations = inmate.inmate_visitors || [];
              
              // Computations
              const detentionDate = new Date(inmate.detention_date);
              const releaseDate = new Date(inmate.release_date);
              const now = new Date('2026-05-18'); // Using simulated current date for consistency
              
              // Calculate years detained accurately handling leap years roughly
              let yearsDetained = now.getFullYear() - detentionDate.getFullYear();
              if (now.getMonth() < detentionDate.getMonth() || (now.getMonth() === detentionDate.getMonth() && now.getDate() < detentionDate.getDate())) {
                yearsDetained--;
              }
              
              return (
                <div key={inmate.id} className="bg-[#14171C]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden group">
                  {/* Header section */}
                  <div className="bg-white/[0.02] border-b border-white/5 px-8 py-6 flex justify-between items-center transition-colors group-hover:bg-white/[0.04]">
                    <div className="flex items-center gap-5">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl h-14 w-14 flex items-center justify-center font-black text-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] relative">
                        {initials}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#14171C]"></div>
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-2 mt-2">
                          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                            {fullName}
                            <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${inmate.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                              {inmate.status.toUpperCase()}
                            </span>
                          </h2>
                          <div className="flex gap-2">
                            {checkEligibility(inmate.block_location, inmate.cell_number, 'physical').eligible ? (
                              <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-blue-500/20 text-blue-400 animate-pulse border border-blue-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Visit Today
                              </span>
                            ) : null}
                            {checkEligibility(inmate.block_location, inmate.cell_number, 'eservices').eligible ? (
                              <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-emerald-500/20 text-emerald-400 animate-pulse border border-emerald-500/30 flex items-center gap-1">
                                <PhoneCall className="w-3 h-3" /> E-Dalaw Today
                              </span>
                            ) : null}
                            {!checkEligibility(inmate.block_location, inmate.cell_number, 'physical').eligible && !checkEligibility(inmate.block_location, inmate.cell_number, 'eservices').eligible && (
                              <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-white/5 text-slate-500 border border-white/10 flex items-center gap-1">
                                No Services Today
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-400 mt-1.5 font-medium items-center">
                          <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-xs border border-white/10 text-blue-300 flex items-center gap-1">
                            <Fingerprint className="w-3 h-3" />
                            {inmate.inmate_number}
                          </span>
                          <span className="flex items-center gap-1"><Key className="w-3.5 h-3.5" /> {inmate.block_location} - Cell {inmate.cell_number}</span>
                          <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${inmate.security_level.toLowerCase() === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : inmate.security_level.toLowerCase() === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                            <Shield className="w-3 h-3" />
                            {inmate.security_level} Security
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 border-b border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5 bg-white/[0.01]">
                    <div className="p-5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Gavel className="w-3.5 h-3.5" /> Convictions
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {inmate.crimes?.map((crime: string, idx: number) => (
                          <span key={idx} className="bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded-md text-xs font-semibold">
                            {crime}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Time Detained
                      </p>
                      <p className="text-lg font-bold text-white">
                        {yearsDetained} <span className="text-sm font-medium text-slate-400">Years</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-mono">Since {detentionDate.toLocaleDateString()}</p>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Possible Release
                      </p>
                      <p className="text-lg font-bold text-white">
                        {releaseDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-blue-400/80 mt-1 font-medium">Eligible for parole review</p>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Demographics
                      </p>
                      <p className="text-sm font-medium text-slate-300">
                        DOB: {new Date(inmate.date_of_birth).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-medium capitalize">
                        {inmate.gender}
                      </p>
                    </div>
                  </div>

                  {/* Visitors Section */}
                  <div className="p-8 bg-[#14171C]/50">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Approved Family & Visitors
                      </h3>
                      <span className="bg-white/5 text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full border border-white/10">
                        {relations.length} Registered
                      </span>
                    </div>
                    
                    {relations.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {relations.map((rel: any, index: number) => {
                          const visitor = rel.visitors;
                          if (!visitor) return null;
                          return (
                            <div key={index} className="flex items-center gap-4 border border-white/10 bg-[#1A1E24] p-4 rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-default shadow-lg">
                              <img src={visitor.document_image_url || 'https://i.pravatar.cc/150'} alt={visitor.first_name} className="w-12 h-12 rounded-full object-cover border-2 border-white/10 shadow-inner" />
                              <div>
                                <p className="font-bold text-slate-200">{visitor.first_name} {visitor.last_name}</p>
                                <p className="text-xs font-medium text-slate-400 mt-0.5">{rel.relationship} • <span className="font-mono">{visitor.identity_document}</span></p>
                              </div>
                              <div className="ml-auto">
                                <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-400 bg-[#1A1E24] py-8 rounded-2xl border border-dashed border-white/10">
                        <ShieldAlert className="w-8 h-8 text-slate-600 mb-1" />
                        <span className="font-bold text-slate-300">No authorized visitors</span>
                        <span className="text-xs text-slate-500">This inmate does not have any approved family members for visitation.</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
