"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Search, 
  Radio, 
  Heart, 
  SkipForward,
  SkipBack,
  Loader2
} from 'lucide-react';
import Hls from 'hls.js';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

export default function App() {
  const [stations, setStations] = useState([]);
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef(null);
  const hlsRef = useRef(null);

  // Fetch stations from API
  useEffect(() => {
    fetch('https://iptv.streamku.net/radio/stream.json')
      .then(res => res.json())
      .then(data => {
        const colors = [
          "from-amber-400 to-orange-500",
          "from-rose-400 to-red-500",
          "from-blue-500 to-indigo-600",
          "from-teal-400 to-emerald-500",
          "from-violet-500 to-purple-600",
          "from-orange-400 to-amber-600"
        ];
        
        const mapped = data.map((item, index) => ({
          id: item.id,
          name: item.name,
          frequency: item.channel || "Radio",
          city: "Indonesia", 
          category: "Semua", // API doesn't provide category, default to Semua
          color: colors[index % colors.length],
          streamUrl: item.url_stream,
          description: item.desc_title,
          imageUrl: item.image_url,
          slug: item.slug
        }));
        
        setStations(mapped);
        if (mapped.length > 0) {
          setCurrentStation(mapped[0]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch stations:", err);
        setIsLoading(false);
      });
  }, []);

  // Filter stations logic
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            station.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Semua" || station.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, stations]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // HLS and source handler
  useEffect(() => {
    if (audioRef.current && currentStation) {
      const audio = audioRef.current;
      
      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (currentStation.streamUrl.includes('.m3u8') && Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(currentStation.streamUrl);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
           // We do not auto-play here to prevent unexpected playback on load,
           // play will be handled by the isPlaying effect if needed.
        });
      } else {
        audio.src = currentStation.streamUrl;
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentStation]);

  // Play/Pause handler
  useEffect(() => {
    if (audioRef.current && currentStation) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Error playing audio:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentStation]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStationSelect = (station) => {
    if (currentStation?.id === station.id) {
      togglePlay();
      return;
    }
    setCurrentStation(station);
    setIsPlaying(true);
  };

  const handleNextStation = () => {
    if (filteredStations.length === 0) return;
    const currentIndex = filteredStations.findIndex(s => s.id === currentStation?.id);
    const validIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (validIndex + 1) % filteredStations.length;
    handleStationSelect(filteredStations[nextIndex]);
  };

  const handlePrevStation = () => {
    if (filteredStations.length === 0) return;
    const currentIndex = filteredStations.findIndex(s => s.id === currentStation?.id);
    const validIndex = currentIndex >= 0 ? currentIndex : 0;
    const prevIndex = (validIndex - 1 + filteredStations.length) % filteredStations.length;
    handleStationSelect(filteredStations[prevIndex]);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  if (isLoading || !currentStation) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-indigo-600">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-slate-50 to-white">
        <Navbar 
          setIsSidebarOpen={setIsSidebarOpen} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        {/* Hero / Now Playing Detail Section */}
        <div className="px-6 md:px-10 py-8">
          <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br ${currentStation.color} shadow-xl shadow-slate-200`}>
            {/* Visualizer Animation Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-20 text-white">
              <Radio size={120} />
            </div>

            <div className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center shadow-inner group overflow-hidden border border-white/20">
              {currentStation.imageUrl ? (
                <div className="absolute inset-0">
                  <img src={currentStation.imageUrl} alt={currentStation.name} className="w-full h-full object-cover opacity-95" />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="flex items-end gap-1 h-16">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i}
                            className="w-2 bg-white rounded-full animate-bounce" 
                            style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100}%`, animationDuration: '0.6s' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                isPlaying ? (
                  <div className="flex items-end gap-1 h-16">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 bg-white rounded-full animate-bounce" 
                        style={{ 
                          animationDelay: `${i * 0.1}s`,
                          height: `${Math.random() * 100}%`,
                          animationDuration: '0.6s'
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Radio size={64} className="text-white/80" />
                )
              )}
            </div>

            <div className="relative z-10 flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs font-bold text-white mb-4 tracking-wide uppercase border border-white/10">
                Sedang Diputar
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight drop-shadow-sm">
                {currentStation.name}
              </h2>
              <p className="text-xl text-white/90 font-medium mb-6 drop-shadow-sm">
                {currentStation.frequency} • {currentStation.city}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button 
                  onClick={togglePlay}
                  className="px-8 py-3 bg-white text-indigo-700 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 border border-white/50"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  {isPlaying ? "Pause Radio" : "Putar Sekarang"}
                </button>
                <button 
                  onClick={() => toggleFavorite(currentStation.id)}
                  className={`p-3 rounded-full border-2 transition-all shadow-sm ${
                    favorites.includes(currentStation.id) 
                    ? 'bg-rose-500 border-rose-500 text-white' 
                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  <Heart size={20} fill={favorites.includes(currentStation.id) ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stations List */}
        <div className="flex-1 px-6 md:px-10 pb-32 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Stasiun Populer</h3>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{filteredStations.length} stasiun</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStations.map(station => (
              <div 
                key={station.id}
                onClick={() => handleStationSelect(station)}
                className={`group p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  currentStation.id === station.id 
                  ? 'bg-indigo-50/50 border-indigo-400 shadow-md shadow-indigo-100' 
                  : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${station.color} flex items-center justify-center text-white shadow-md shrink-0 relative overflow-hidden border border-black/5`}>
                    {station.imageUrl ? (
                      <img src={station.imageUrl} alt={station.name} className="w-full h-full object-cover" />
                    ) : (
                      <Radio size={24} />
                    )}
                    {currentStation.id === station.id && isPlaying && (
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="flex gap-0.5 h-3 items-end">
                          <div className="w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                          <div className="w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`font-bold truncate ${currentStation.id === station.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {station.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate font-medium">{station.frequency} • {station.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStations.length === 0 && (
            <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
              <Search size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Tidak ada stasiun yang cocok dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      </main>

      {/* Persistent Player Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex items-center px-4 md:px-8 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          {/* Current Info */}
          <div className="flex items-center gap-4 w-1/4 min-w-[120px]">
            <div className={`hidden sm:flex w-12 h-12 rounded-lg bg-gradient-to-br ${currentStation.color} items-center justify-center text-white shrink-0 shadow-md relative overflow-hidden border border-black/5`}>
              {currentStation.imageUrl ? (
                <img src={currentStation.imageUrl} alt={currentStation.name} className="w-full h-full object-cover" />
              ) : (
                <Radio size={20} />
              )}
            </div>
            <div className="min-w-0">
              <h5 className="font-bold text-sm text-slate-900 truncate">{currentStation.name}</h5>
              <p className="text-xs text-slate-500 font-medium truncate">{currentStation.frequency}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-4 md:gap-8">
              <button 
                onClick={handlePrevStation}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <SkipBack size={20} />
              </button>
              <button 
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-indigo-600/30"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
              </button>
              <button 
                onClick={handleNextStation}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <SkipForward size={20} />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2 w-full max-w-md mt-1">
              <span className="text-[10px] text-slate-400 font-bold tracking-wider">LIVE</span>
              <div className="flex-1 h-1 bg-slate-200 rounded-full relative overflow-hidden">
                <div className={`absolute inset-0 bg-indigo-500/50 ${isPlaying ? 'animate-pulse' : ''}`} />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">On Air</span>
              </div>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="hidden sm:block w-24 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:bg-slate-300 transition-colors"
            />
          </div>
        </div>
      </footer>

      {/* Global CSS for scrollbar and animation */}
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
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}} />
    </div>
  );
}
