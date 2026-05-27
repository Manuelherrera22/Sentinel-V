"use client";

import React, { useState } from 'react';
import { CalendarClock, PhoneCall, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { VISITATION_SCHEDULE, E_SERVICES_SCHEDULE } from '@/lib/schedule';

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'physical' | 'eservices'>('eservices');
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDaysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  const currentSchedule = activeTab === 'physical' ? VISITATION_SCHEDULE : E_SERVICES_SCHEDULE;

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  // Helper to compress array of dorms to string
  const formatDorms = (dorms: any[]) => {
    if (!Array.isArray(dorms)) return '';
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
    return summary.join(', ');
  };

  return (
    <div className="p-4 md:p-10 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="mx-auto max-w-6xl w-full flex-1 flex flex-col">
        <header className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Services Schedule</h1>
            <p className="text-slate-400 mt-2 font-medium flex items-center gap-2 text-sm md:text-base">
              <CalendarClock className="w-4 h-4 text-blue-500" /> Facility approved access blocks
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 bg-[#14171C] p-1.5 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('physical')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${
                activeTab === 'physical' 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarClock className="w-4 h-4" />
              Physical Visit
            </button>
            <button 
              onClick={() => setActiveTab('eservices')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${
                activeTab === 'eservices' 
                  ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              E-Services
            </button>
          </div>
        </header>

        {activeTab === 'eservices' && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 w-fit">
             <PhoneCall className="w-5 h-5 text-emerald-400" />
             <div>
               <p className="font-bold text-emerald-400 uppercase tracking-widest text-[10px]">Standard Time Slots</p>
               <p className="text-white font-medium text-sm">{E_SERVICES_SCHEDULE.timeSlots}</p>
             </div>
          </div>
        )}

        {/* Calendar Card */}
        <div className="bg-[#0A0A0B]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col">
          {/* Calendar Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-3xl font-black text-white">
              {currentDate.toLocaleString('default', { month: 'long' })} <span className="text-slate-500">{currentYear}</span>
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <div className="min-w-[700px] h-full flex flex-col">
              {/* Days of Week Row */}
              <div className="grid grid-cols-7 border-b border-white/5 bg-black/20">
                {shortDaysOfWeek.map((day, idx) => (
                  <div key={idx} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-white/[0.01]">
                {/* Empty Offset Cells */}
                {Array.from({ length: startDay }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="border-b border-r border-white/5 min-h-[120px] opacity-20"></div>
                ))}

                {/* Date Cells */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateObj = new Date(currentYear, currentMonth, dayNum);
                  const dayName = daysOfWeek[dateObj.getDay()];
                  const scheduleForDay = (currentSchedule as any)[dayName];
                  const todayFlag = isToday(dayNum);

                  return (
                    <div key={`day-${dayNum}`} className={`border-b border-r border-white/5 min-h-[120px] p-2 flex flex-col transition-colors hover:bg-white/5 relative ${todayFlag ? 'bg-blue-500/5' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        {todayFlag ? (
                          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            {dayNum}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold text-sm w-7 h-7 flex items-center justify-center">
                            {dayNum}
                          </span>
                        )}
                      </div>

                      {/* Event Pills */}
                      <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
                        {scheduleForDay && dayName !== 'timeSlots' && Object.entries(scheduleForDay).map(([building, dorms]: [string, any]) => {
                          if (building === 'timeSlots') return null;
                          const isBuilding1 = building.includes('1');
                          const pillColor = isBuilding1 
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                            : 'bg-pink-500/20 text-pink-300 border-pink-500/30';

                          return (
                            <div key={building} className={`px-2 py-1.5 rounded-lg border ${pillColor} text-[10px] md:text-xs leading-tight`}>
                              <div className="font-bold flex items-center gap-1 mb-0.5">
                                <Building2 className="w-3 h-3 opacity-70" />
                                {building}
                              </div>
                              <div className="opacity-80 line-clamp-1 font-medium">Dorm {formatDorms(dorms)}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Fill remaining cells to complete the grid */}
                {Array.from({ length: (42 - (startDay + daysInMonth)) % 7 }).map((_, idx) => (
                  <div key={`fill-${idx}`} className="border-b border-r border-white/5 min-h-[120px] opacity-20"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
