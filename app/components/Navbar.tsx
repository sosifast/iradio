"use client";
import React from 'react';
import { Menu, Search, Settings } from 'lucide-react';

export default function Navbar({ 
  setIsSidebarOpen, 
  searchQuery, 
  setSearchQuery 
}: {
  setIsSidebarOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) {
  return (
    <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <button 
        className="md:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      <div className="relative flex-1 max-w-md mx-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari stasiun atau kota..."
          className="w-full bg-slate-100/80 border border-slate-200 text-slate-900 placeholder:text-slate-500 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md cursor-pointer hover:bg-indigo-700 transition-colors">
          JD
        </div>
      </div>
    </header>
  );
}
