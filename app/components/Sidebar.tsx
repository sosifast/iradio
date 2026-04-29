"use client";
import React from 'react';
import { Globe, Heart, Mic2, Music } from 'lucide-react';

const CATEGORIES = ["Semua", "Pop", "Rock", "Mix", "Indie", "Easy Listening"];

export default function Sidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activeCategory, 
  setActiveCategory 
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
}) {
  return (
    <>
      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center mb-8">
            <img 
              src="https://ik.imagekit.io/bfrfvbniv/Untitled%20design.png" 
              alt="Logo" 
              className="h-10 w-auto object-contain drop-shadow-sm"
            />
          </div>

          <nav className="space-y-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl transition-all font-medium">
              <Globe size={20} />
              <span>Jelajah</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all font-medium">
              <Heart size={20} />
              <span>Favorit</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all font-medium">
              <Mic2 size={20} />
              <span>Podcast</span>
            </button>
          </nav>

          <div className="mt-10">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Kategori</p>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition-all font-medium ${
                    activeCategory === cat 
                      ? 'bg-slate-100 text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Music size={16} className={activeCategory === cat ? "text-indigo-600" : "text-slate-400"} />
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
