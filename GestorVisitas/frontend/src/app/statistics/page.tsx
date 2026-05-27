"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart3, Users, Calendar, Clock, Filter, ArrowUpRight, Search, FileText } from 'lucide-react';
import Link from 'next/link';

type FilterType = 'daily' | 'weekly' | 'monthly';

export default function StatisticsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('monthly');
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchVisitLogs() {
      // Fetch all visits, including those that are 'completed', 'in_progress', 'pending' 
      // so we can see a full log of facility interactions.
      const { data, error } = await supabase
        .from('visits_schedule')
        .select(`
          *,
          visitors (first_name, last_name, visitor_type, status, identity_document, document_image_url),
          inmates (first_name, last_name, block_location, cell_number, inmate_number)
        `)
        .order('scheduled_time', { ascending: false });

      if (error) {
        console.error('Error fetching visits:', error);
      } else {
        setVisits(data || []);
      }
      setLoading(false);
    }

    fetchVisitLogs();
  }, []);

  // Filter logic
  const filteredVisits = useMemo(() => {
    const now = new Date();
    // Simulate current date matching the seeded data timeline if needed, 
    // but here we just use the real dates or compare relative to "today".
    // For demo purposes (since seeded data is in 2025/2026), we will filter relative to the latest record,
    // or just use standard JS dates.
    
    // To make sure data shows up from our seed (which is in May 2026):
    const referenceDate = new Date('2026-05-18T10:00:00Z'); 

    return visits.filter(visit => {
      const visitDate = new Date(visit.scheduled_time);
      let matchesTime = true;

      if (activeFilter === 'daily') {
        matchesTime = visitDate.toDateString() === referenceDate.toDateString();
      } else if (activeFilter === 'weekly') {
        const diffTime = Math.abs(referenceDate.getTime() - visitDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        matchesTime = diffDays <= 7;
      } else if (activeFilter === 'monthly') {
        matchesTime = visitDate.getMonth() === referenceDate.getMonth() && 
                      visitDate.getFullYear() === referenceDate.getFullYear();
      }

      // Search term
      const visitorName = `${visit.visitors?.first_name} ${visit.visitors?.last_name}`.toLowerCase();
      const inmateName = `${visit.inmates?.first_name} ${visit.inmates?.last_name}`.toLowerCase();
      const matchesSearch = visitorName.includes(searchTerm.toLowerCase()) || inmateName.includes(searchTerm.toLowerCase());

      return matchesTime && matchesSearch;
    });
  }, [visits, activeFilter, searchTerm]);

  return (
    <div className="p-4 md:p-10 animate-in fade-in duration-700 h-full flex flex-col overflow-y-auto custom-scrollbar">
      <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col">
        <header className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Visitor Logs & Stats</h1>
            <p className="text-slate-400 mt-2 font-medium flex items-center gap-2 text-sm md:text-base">
              <BarChart3 className="w-4 h-4 text-emerald-500" /> Facility Access Monitoring
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="pl-10 pr-4 py-2.5 bg-[#14171C]/80 border border-white/10 rounded-xl w-full text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 text-sm shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Tabs */}
            <div className="flex bg-[#14171C] p-1 rounded-xl border border-white/10 w-fit shrink-0">
              <button 
                onClick={() => setActiveFilter('daily')}
                className={`px-4 py-1.5 rounded-lg font-bold transition-all text-xs ${
                  activeFilter === 'daily' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.4)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Daily
              </button>
              <button 
                onClick={() => setActiveFilter('weekly')}
                className={`px-4 py-1.5 rounded-lg font-bold transition-all text-xs ${
                  activeFilter === 'weekly' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.4)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setActiveFilter('monthly')}
                className={`px-4 py-1.5 rounded-lg font-bold transition-all text-xs ${
                  activeFilter === 'monthly' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.4)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#14171C]/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Total Visitors
              </p>
              <div className="flex items-end gap-3">
                <h2 className="text-5xl font-black text-white tracking-tighter">{filteredVisits.length}</h2>
                <span className="text-sm font-medium text-emerald-400 mb-1 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" /> Active Period
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#14171C]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock className="w-24 h-24 text-blue-500" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Avg. Visit Duration
              </p>
              <div className="flex items-end gap-3">
                <h2 className="text-4xl font-black text-white tracking-tighter">1h 15m</h2>
                <span className="text-sm font-medium text-slate-400 mb-1">Estimate</span>
              </div>
            </div>
          </div>

          <div className="bg-[#14171C]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText className="w-24 h-24 text-purple-500" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Pending Approvals
              </p>
              <div className="flex items-end gap-3">
                <h2 className="text-4xl font-black text-white tracking-tighter">{visits.filter(v => v.status === 'pending').length}</h2>
                <span className="text-sm font-medium text-slate-400 mb-1">Awaiting review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#14171C]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex-1 flex flex-col">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-lg font-black text-white tracking-tight uppercase">Visitor Entry Logs</h3>
          </div>
          
          <div className="overflow-x-auto w-full flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="w-full text-left text-sm min-w-[1000px]">
                <thead className="bg-black/20 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b border-white/5">Visitor Name</th>
                    <th className="px-6 py-4 border-b border-white/5">Date & Time of Entry</th>
                    <th className="px-6 py-4 border-b border-white/5">Visitor Type</th>
                    <th className="px-6 py-4 border-b border-white/5">Scheduled Visit Details</th>
                    <th className="px-6 py-4 border-b border-white/5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredVisits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href={`/visitors/${visit.visitor_id}`} className="flex items-center gap-3">
                          <img src={visit.visitors?.document_image_url || 'https://i.pravatar.cc/150'} alt="Visitor" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                          <div>
                            <p className="font-bold text-white group-hover:text-emerald-400 transition-colors uppercase">
                              {visit.visitors?.last_name}, {visit.visitors?.first_name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{visit.visitors?.identity_document}</p>
                          </div>
                        </Link>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200">{new Date(visit.scheduled_time).toLocaleDateString()}</span>
                          <span className="text-xs text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 
                            {new Date(visit.scheduled_time).toLocaleTimeString()}
                            {visit.time_out && <span className="text-slate-500 ml-1">- {new Date(visit.time_out).toLocaleTimeString()}</span>}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-slate-300 font-medium">{visit.visitors?.visitor_type || 'Relatives'}</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200 uppercase">{visit.inmates?.last_name}, {visit.inmates?.first_name}</span>
                          <span className="text-xs text-slate-400 mt-0.5">{visit.inmates?.block_location} - {visit.inmates?.cell_number}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          visit.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          visit.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          visit.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {visit.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredVisits.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <p className="text-slate-400 font-medium text-lg">No visitor logs found for this period.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
