"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  User, Calendar, MapPin, Phone, ShieldAlert, FileText, 
  Clock, Shield, Image as ImageIcon, Download, 
  Building2, History, AlertTriangle, ArrowLeft, Printer
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function VisitorProfilePage() {
  const params = useParams();
  const visitorId = params.id as string;
  
  const [visitor, setVisitor] = useState<any>(null);
  const [inmates, setInmates] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch Visitor Profile
      const { data: vData } = await supabase
        .from('visitors')
        .select('*')
        .eq('id', visitorId)
        .single();
      
      if (vData) setVisitor(vData);

      // 2. Fetch Inmates they are linked to
      const { data: relData } = await supabase
        .from('inmate_visitors')
        .select('relationship, inmates(first_name, last_name, block_location, cell_number)')
        .eq('visitor_id', visitorId);
        
      if (relData) setInmates(relData);

      // 3. Fetch Visit History
      const { data: vHist } = await supabase
        .from('visits_schedule')
        .select('*')
        .eq('visitor_id', visitorId)
        .order('scheduled_time', { ascending: false });
        
      if (vHist) setVisits(vHist);

      // 4. Fetch Blacklist History
      const { data: bHist } = await supabase
        .from('blacklist_history')
        .select('*')
        .eq('visitor_id', visitorId)
        .order('date_issued', { ascending: false });
        
      if (bHist) setBlacklist(bHist);

      setLoading(false);
    }
    loadData();
  }, [visitorId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!visitor) {
    return <div className="p-10 text-white text-center text-xl">Visitor not found</div>;
  }

  const age = visitor.date_of_birth ? new Date().getFullYear() - new Date(visitor.date_of_birth).getFullYear() : 'N/A';

  return (
    <div className="p-4 md:p-10 animate-in fade-in duration-700 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar">
      <Link href="/inmates" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 font-medium text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>
      
      {/* Header Profile Section */}
      <div className="bg-[#14171C]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <User className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col gap-4 items-center">
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-[#0A0A0B]">
              {visitor.document_image_url ? (
                <img src={visitor.document_image_url} alt={visitor.first_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-700">
                  <User className="w-20 h-20" />
                </div>
              )}
            </div>
            <div className="flex gap-2 w-full">
              <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                <ImageIcon className="w-4 h-4" /> Retake Photo
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                  {visitor.last_name}, {visitor.first_name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-lg border ${visitor.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {visitor.status || 'Active'}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold">
                    AGE {age}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time In
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold border border-white/10 transition-all flex items-center gap-2">
                  <Printer className="w-4 h-4" /> Print Profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Date of Birth</span>
                  <span className="text-slate-200 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> {visitor.date_of_birth ? new Date(visitor.date_of_birth).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Civil Status</span>
                  <span className="text-slate-200 font-medium">{visitor.civil_status || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Residential Address</span>
                  <span className="text-slate-200 font-medium flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /> {visitor.residential_address || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Zip Code</span>
                  <span className="text-slate-200 font-medium">{visitor.zip_code || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Visitor Type</span>
                  <span className="text-slate-200 font-medium">{visitor.visitor_type || 'Relatives - Family/Friends'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Contact No.</span>
                  <span className="text-slate-200 font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" /> {visitor.phone_number || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Citizenship</span>
                  <span className="text-slate-200 font-medium">{visitor.citizenship || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Gender</span>
                  <span className="text-slate-200 font-medium">{visitor.gender || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Schedule of Dalaw */}
        <div className="bg-[#14171C]/80 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Calendar className="w-32 h-32 text-blue-500" />
          </div>
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Schedule of Dalaw<br/><span className="text-[10px] text-blue-400">With Time and Date</span></h2>
          </div>
          <div className="space-y-3 relative z-10">
            {visits.filter(v => v.status === 'pending' || v.status === 'approved').length > 0 ? (
              visits.filter(v => v.status === 'pending' || v.status === 'approved').map(visit => (
                <div key={visit.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{new Date(visit.scheduled_time).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-400">{new Date(visit.scheduled_time).toLocaleTimeString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {visit.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 border-dashed text-center">
                <p className="text-sm font-medium text-slate-400">No upcoming schedules.</p>
              </div>
            )}
          </div>
        </div>

        {/* Documentary Requirements */}
        <div className="bg-[#14171C]/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileText className="w-32 h-32 text-emerald-500" />
          </div>
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Documentary<br/><span className="text-[10px] text-emerald-400">Requirements</span></h2>
            </div>
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Upload
            </button>
          </div>
          <div className="space-y-3 relative z-10">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center group cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Valid ID Scanned Copy</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">PDF Document</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold">VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* PDL Information */}
      <div className="bg-[#14171C]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden mb-8">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-black text-white tracking-tight uppercase">Name of PDL <span className="text-xs text-slate-500 font-medium lowercase ml-2">(Person Deprived of Liberty)</span></h2>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-1">
            + Add Inmate
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-black/20 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4 border-b border-white/5">Name</th>
                <th className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">Building and Dorm</th>
                <th className="px-6 py-4 border-b border-white/5">Relationship</th>
                <th className="px-6 py-4 border-b border-white/5 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inmates.map((rel, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white uppercase">{rel.inmates.last_name}, {rel.inmates.first_name}</td>
                  <td className="px-6 py-4 bg-white/[0.02]">
                    <span className="flex items-center gap-2 font-mono text-blue-300 bg-blue-500/10 px-2 py-1 rounded w-fit border border-blue-500/20 text-xs">
                      <Building2 className="w-3 h-3" /> {rel.inmates.block_location} - {rel.inmates.cell_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-300">{rel.relationship}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-red-400 hover:text-red-300 font-black">×</button>
                  </td>
                </tr>
              ))}
              {inmates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No PDL associated with this visitor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blacklist History */}
      <div className="bg-[#14171C]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden mb-8">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-black text-white tracking-tight uppercase">Blacklist History</h2>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-1">
            + Add Blacklist Entry
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-black/20 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4 border-b border-white/5">Date Issued</th>
                <th className="px-6 py-4 border-b border-white/5">Date From</th>
                <th className="px-6 py-4 border-b border-white/5">Date To</th>
                <th className="px-6 py-4 border-b border-white/5">Remarks</th>
                <th className="px-6 py-4 border-b border-white/5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blacklist.map(b => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-300">{new Date(b.date_issued).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-300">{new Date(b.date_from).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-300">{b.date_to ? new Date(b.date_to).toLocaleDateString() : 'Indefinite'}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{b.remarks}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${b.status === 'active' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {blacklist.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Clean record. No blacklist history.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visit History */}
      <div className="bg-[#14171C]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden mb-8">
        <div className="flex items-center p-6 border-b border-white/5 bg-white/[0.02]">
          <History className="w-5 h-5 text-blue-400 mr-3" />
          <h2 className="text-lg font-black text-white tracking-tight uppercase">Visit History</h2>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-black/20 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4 border-b border-white/5">Date</th>
                <th className="px-6 py-4 border-b border-white/5">Time In</th>
                <th className="px-6 py-4 border-b border-white/5">Time Out</th>
                <th className="px-6 py-4 border-b border-white/5">Jail Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visits.filter(v => v.status === 'completed').map(visit => (
                <tr key={visit.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{new Date(visit.scheduled_time).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-mono text-emerald-400">{new Date(visit.scheduled_time).toLocaleTimeString()}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{visit.time_out ? new Date(visit.time_out).toLocaleTimeString() : '--:--'}</td>
                  <td className="px-6 py-4 font-medium text-slate-300">{visit.jail_assignment}</td>
                </tr>
              ))}
              {visits.filter(v => v.status === 'completed').length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No past visits recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
