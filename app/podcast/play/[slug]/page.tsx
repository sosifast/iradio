"use client";
import React, { useState, useRef, useEffect, use } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Loader2,
  Mic2,
  Share2,
  Heart
} from 'lucide-react';
import Hls from 'hls.js';
import Sidebar from '../../../../app/components/Sidebar';
import Navbar from '../../../../app/components/Navbar';
import { AdTop, AdBottom } from '../../../../app/components/AdBanners';

export default function PodcastPlayer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<any>(null);

  // Mock Podcast Data - in reality, fetch this based on the slug
  const podcast = {
    title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    host: "Kreator Pilihan",
    episode: "Episode Spesial",
    description: "Dengarkan diskusi mendalam dan cerita seru di episode podcast ini. Pastikan Anda menyimak sampai akhir!",
    imageUrl: "https://ik.imagekit.io/bfrfvbniv/stre%20amku.png",
    // You can test changing this URL to mp3, m4a, mp4, or m3u8
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  };

  useEffect(() => {
    // Simulate API load
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [slug]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Setup Player (HLS / Native)
  useEffect(() => {
    if (!audioRef.current || isLoading) return;
    
    const audio = audioRef.current;
    
    // Clean up previous HLS
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const url = podcast.audioUrl;

    if (url.includes('.m3u8') && Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // ready to play
      });
    } else {
      // Native support for mp3, m4a, mp4, and m3u8 (Safari)
      audio.src = url;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [podcast.audioUrl, isLoading]);

  // Handle Play/Pause
  useEffect(() => {
    if (audioRef.current && !isLoading) {
      if (isPlaying) {
        audioRef.current.play().catch((e: any) => {
          console.error("Error playing audio:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isLoading]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
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
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <Navbar 
          setIsSidebarOpen={setIsSidebarOpen} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-32">
          <div className="px-6 md:px-10 py-8 pb-4">
            <AdTop />
            
            {/* Podcast Player Card */}
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-slate-200 mt-4">
              <div className="absolute top-0 right-0 p-8 opacity-20 text-white">
                <Mic2 size={160} />
              </div>

              {/* Cover Art */}
              <div className="relative z-10 w-56 h-56 md:w-64 md:h-64 rounded-2xl bg-white flex items-center justify-center shadow-2xl overflow-hidden border-4 border-white/20 group">
                <img src={podcast.imageUrl} alt={podcast.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {isPlaying && (
                  <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex items-end gap-1.5 h-16">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-3 bg-white rounded-full animate-bounce shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                          style={{ animationDelay: `${i * 0.15}s`, height: `${Math.random() * 100}%`, animationDuration: '0.8s' }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Player Info & Controls */}
              <div className="relative z-10 flex-1 text-center md:text-left w-full">
                <div className="inline-block px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs font-bold text-white mb-4 tracking-wide uppercase border border-white/10">
                  {podcast.episode}
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-sm">
                  {podcast.title}
                </h2>
                <p className="text-lg text-white/90 font-medium mb-8 drop-shadow-sm flex items-center justify-center md:justify-start gap-2">
                  <Mic2 size={18} /> {podcast.host}
                </p>

                {/* Progress Bar */}
                <div className="mb-8 w-full max-w-2xl">
                  <div className="flex justify-between text-xs font-bold text-white/80 mb-2 tracking-wider">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={duration || 100} 
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer accent-white hover:accent-indigo-200 transition-all"
                  />
                </div>

                {/* Main Controls */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-full border-2 transition-all shadow-sm ${
                      isFavorite 
                      ? 'bg-rose-500 border-rose-500 text-white' 
                      : 'bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                  </button>

                  <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10">
                    <button onClick={skipBackward} className="p-3 text-white/80 hover:text-white transition-colors">
                      <SkipBack size={24} />
                    </button>
                    <button 
                      onClick={togglePlay}
                      className="w-16 h-16 rounded-full bg-white text-indigo-700 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
                    </button>
                    <button onClick={skipForward} className="p-3 text-white/80 hover:text-white transition-colors">
                      <SkipForward size={24} />
                    </button>
                  </div>

                  <button className="p-3 rounded-full bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all shadow-sm">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
            </div>
            
            <AdBottom />

            {/* Episode Details */}
            <div className="mt-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Tentang Episode Ini</h3>
              <p className="text-slate-600 leading-relaxed">
                {podcast.description}
              </p>
            </div>

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
