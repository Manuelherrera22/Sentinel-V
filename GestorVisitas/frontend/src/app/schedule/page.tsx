"use client";

import React, { useState } from 'react';
import { CalendarClock, CheckCircle2, ShieldAlert, Building2, PhoneCall } from 'lucide-react';
import { VISITATION_SCHEDULE, E_SERVICES_SCHEDULE } from '@/lib/schedule';

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'physical' | 'eservices'>('eservices');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const today = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[today.getDay()];

  const currentSchedule = activeTab === 'physical' ? VISITATION_SCHEDULE : E_SERVICES_SCHEDULE;

  return (
    <div className="p-4 md:p-10 animate-in fade-in duration-700">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Services Schedule</h1>
            <p className="text-slate-400 mt-2 font-medium flex items-center gap-2 text-sm md:text-base">
              <CalendarClock className="w-4 h-4 text-blue-500" /> Facility approved access blocks
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Current Day</p>
            <p className="text-lg font-black text-white">{todayName}</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('physical')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'physical' 
                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
          >
            <CalendarClock className="w-5 h-5" />
            Physical Visitation
          </button>
          <button 
            onClick={() => setActiveTab('eservices')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'eservices' 
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)]' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-5 h-5" />
            E-Dalaw / E-Tawag
          </button>
        </div>

        {activeTab === 'eservices' && (
          <div className="mb-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
             <PhoneCall className="w-6 h-6 text-emerald-400" />
             <div>
               <p className="font-bold text-emerald-400 uppercase tracking-widest text-xs">Standard Time Slots</p>
               <p className="text-white font-medium">{E_SERVICES_SCHEDULE.timeSlots}</p>
             </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {days.map(day => {
            const isToday = day === todayName;
            const scheduleForDay = (currentSchedule as any)[day];
            
            return (
              <div 
                key={day} 
                className={`rounded-3xl border shadow-xl flex flex-col overflow-hidden transition-all duration-300 ${
                  isToday 
                    ? `bg-${activeTab === 'physical' ? 'blue' : 'emerald'}-600/10 border-${activeTab === 'physical' ? 'blue' : 'emerald'}-500/50 shadow-[0_0_30px_-5px_rgba(${activeTab === 'physical' ? '59,130,246' : '16,185,129'},0.3)] scale-[1.02]` 
                    : 'bg-[#14171C]/80 border-white/10 backdrop-blur-xl'
                }`}
              >
                <div className={`px-6 py-4 border-b ${isToday ? `bg-${activeTab === 'physical' ? 'blue' : 'emerald'}-500/20 border-${activeTab === 'physical' ? 'blue' : 'emerald'}-500/30` : 'bg-white/[0.02] border-white/5'} flex justify-between items-center`}>
                  <h2 className={`text-xl font-bold ${isToday ? 'text-white' : 'text-slate-300'}`}>{day}</h2>
                  {isToday && (
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-${activeTab === 'physical' ? 'blue' : 'emerald'}-500 text-white animate-pulse`}>
                      Today
                    </span>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col gap-4">
                  {!scheduleForDay || day === 'timeSlots' ? (
                    <div className="flex flex-col items-center justify-center flex-1 py-8 text-center opacity-60">
                      <ShieldAlert className="w-8 h-8 text-slate-500 mb-3" />
                      <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">No Services</p>
                      <p className="text-xs text-slate-500 mt-1">Not scheduled for this day</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(scheduleForDay).map(([building, dorms]: [string, any]) => {
                        if (building === 'timeSlots') return null;
                        
                        // Format the array of dorms logic to string e.g. "1, 2, 5-8" or just listing them
                        let dormStr = '';
                        if (Array.isArray(dorms)) {
                           // Try to summarize consecutive numbers
                           const summary = [];
                           let start = dorms[0];
                           let prev = dorms[0];
                           for (let i = 1; i <= dorms.length; i++) {
                             if (dorms[i] === prev + 1) {
                               prev = dorms[i];
                             } else {
                               if (start === prev) summary.push(`${start}`);
                               else summary.push(`${start}-${prev}`);
                               start = dorms[i];
                               prev = dorms[i];
                             }
                           }
                           dormStr = summary.join(', ');
                        }

                        return (
                          <div key={building} className="bg-white/5 border border-white/10 rounded-2xl p-4 group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className={`w-4 h-4 text-${activeTab === 'physical' ? 'blue' : 'emerald'}-400`} />
                              <h3 className="font-bold text-slate-200">{building}</h3>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Eligible Dorms:</span>
                              <span className={`font-mono font-bold text-${activeTab === 'physical' ? 'blue' : 'emerald'}-300 bg-${activeTab === 'physical' ? 'blue' : 'emerald'}-500/10 px-2 py-1 rounded border border-${activeTab === 'physical' ? 'blue' : 'emerald'}-500/20 leading-relaxed text-sm`}>
                                {dormStr}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                
                {scheduleForDay && day !== 'timeSlots' && (
                  <div className={`px-6 py-3 border-t text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                    isToday ? `bg-${activeTab === 'physical' ? 'blue' : 'emerald'}-500/10 border-${activeTab === 'physical' ? 'blue' : 'emerald'}-500/20 text-${activeTab === 'physical' ? 'blue' : 'emerald'}-400` : 'bg-emerald-500/5 border-white/5 text-emerald-500'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" /> Services Active
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
