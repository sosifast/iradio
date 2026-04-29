"use client";
import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  Mic2
} from 'lucide-react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { AdTop, AdBottom } from '../components/AdBanners';

export default function PodcastPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Placeholder data for podcasts
  const podcasts = [
    { id: 1, title: "Ngobrol Santai Pagi", host: "Rian & Dika", episodes: 24, imageUrl: "https://ik.imagekit.io/bfrfvbniv/stre%20amku.png" },
    { id: 2, title: "Misteri Malam", host: "Tim Penelusur", episodes: 12, imageUrl: "https://ik.imagekit.io/bfrfvbniv/stre%20amku.png" },
    { id: 3, title: "Kesehatan Mental 101", host: "Dr. Ayu", episodes: 8, imageUrl: "https://ik.imagekit.io/bfrfvbniv/stre%20amku.png" },
    { id: 4, title: "Tech Talk Indo", host: "Komunitas Dev", episodes: 45, imageUrl: "https://ik.imagekit.io/bfrfvbniv/stre%20amku.png" },
    { id: 5, title: "Cerita Horor Kita", host: "Budi Santoso", episodes: 50, imageUrl: "https://ik.imagekit.io/bfrfvbniv/stre%20amku.png" },
    { id: 6, title: "Investasi Pemula", host: "Fintech ID", episodes: 18, imageUrl: "https://ik.imagekit.io/bfrfvbniv/stre%20amku.png" },
  ];

  const filteredPodcasts = podcasts.filter(podcast => 
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    podcast.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <Navbar 
          setIsSidebarOpen={setIsSidebarOpen} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
          {/* Header Section */}
          <div className="px-6 md:px-10 py-8 pb-4">
            <AdTop />
            
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-slate-200 mt-4">
              <div className="absolute top-0 right-0 p-8 opacity-20 text-white">
                <Mic2 size={120} />
              </div>

              <div className="relative z-10 w-48 h-48 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center shadow-inner group overflow-hidden border border-white/20">
                <Mic2 size={64} className="text-white/80" />
              </div>

              <div className="relative z-10 flex-1 text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs font-bold text-white mb-4 tracking-wide uppercase border border-white/10">
                  Eksklusif
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-sm">
                  Kumpulan Podcast Pilihan
                </h2>
                <p className="text-xl text-white/90 font-medium mb-6 drop-shadow-sm">
                  Dengarkan cerita dan obrolan seru dari berbagai kreator.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <button className="px-8 py-3 bg-white text-indigo-700 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 border border-white/50">
                    <Play size={20} fill="currentColor" />
                    Mulai Dengar
                  </button>
                </div>
              </div>
            </div>
            
            <AdBottom />
          </div>

          {/* Podcast List */}
          <div className="px-6 md:px-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Semua Podcast</h3>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{filteredPodcasts.length} acara</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPodcasts.map(podcast => (
                <Link 
                  href={`/podcast/play/${podcast.title.toLowerCase().replace(/ /g, '-')}`}
                  key={podcast.id}
                  className="group p-4 rounded-2xl border bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95 block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0 overflow-hidden border border-black/5">
                      <Mic2 size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold truncate text-slate-800">
                        {podcast.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate font-medium">{podcast.host} • {podcast.episodes} Episode</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPodcasts.length === 0 && (
              <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Tidak ada podcast yang cocok dengan pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global CSS for scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
}
