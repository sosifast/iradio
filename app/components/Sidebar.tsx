"use client";
import React from 'react';
import { Globe, Mic2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
}) {
  const pathname = usePathname();
  
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
            <Link 
              href="/"
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${
                pathname === '/' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Globe size={20} />
              <span>Jelajah</span>
            </Link>
            <Link 
              href="/podcast"
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${
                pathname === '/podcast' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Mic2 size={20} />
              <span>Podcast</span>
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
