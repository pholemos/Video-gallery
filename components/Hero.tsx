import React, { useState, useEffect } from 'react';
import { Youtube, Search, X, Play } from 'lucide-react';
import { VIDEO_DATA } from '../constants';
import { VideoData } from '../types';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultsCount: number;
  onEnter: () => void;
}

const Hero: React.FC<HeroProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  resultsCount,
  onEnter
}) => {
  const [featuredVideo, setFeaturedVideo] = useState<VideoData | null>(null);
  const isFiltered = searchQuery !== '';

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * VIDEO_DATA.length);
      setFeaturedVideo(VIDEO_DATA[randomIndex]);

      // Close after 3 seconds
      setTimeout(() => {
        setFeaturedVideo(null);
      }, 3000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEnter();
    }
  };

  const handleFeaturedClick = () => {
    if (featuredVideo) {
      window.open(`https://www.youtube.com/watch?v=${featuredVideo.id}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6">
      <div className="relative w-full max-w-4xl text-center">
        {/* Red Glow effect behind text */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[100px]" />
        
        <h1 className="mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-5xl font-extrabold tracking-tighter text-transparent sm:text-7xl drop-shadow-sm uppercase">
          Explore
        </h1>
        
        <p className="mx-auto mb-8 max-w-xl text-base text-slate-400 sm:text-lg leading-relaxed">
          {isFiltered 
            ? `Found ${resultsCount} tutorials matching your search. Press Enter to view list.`
            : "Master smart home technology with our latest expert tutorials and DIY guides."
          }
        </p>

        {/* Search Bar - Red Highlights */}
        <div className="flex flex-col items-stretch gap-3 mb-10 pointer-events-auto max-w-lg mx-auto w-full">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search tutorials... (Press Enter)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-800/60 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pointer-events-auto relative">
          <a 
            href="https://www.youtube.com/@diymadeeasy1824?sub_confirmation=1" 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full bg-red-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 hover:shadow-red-600/40 hover:-translate-y-1"
          >
            <Youtube className="h-5 w-5 fill-current" />
            <span className="uppercase tracking-widest">Subscribe</span>
          </a>

          {/* Random Featured Video Popup */}
          <div className={`absolute top-full mt-6 w-full max-w-[280px] transition-all duration-500 transform ${featuredVideo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            {featuredVideo && (
              <button 
                onClick={handleFeaturedClick}
                className="group flex w-full flex-col overflow-hidden rounded-xl border border-red-500/40 bg-slate-900/90 p-2 shadow-2xl shadow-red-900/20 backdrop-blur-xl transition-transform hover:scale-105"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img 
                    src={featuredVideo.thumb} 
                    alt={featuredVideo.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play fill="white" className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-2 left-2 rounded bg-red-600 px-1.5 py-0.5 text-[8px] font-black text-white uppercase tracking-tighter">
                    Suggested
                  </div>
                </div>
                <div className="p-2 text-left">
                  <h4 className="line-clamp-1 text-[10px] font-black text-white uppercase tracking-tight group-hover:text-red-400 transition-colors">
                    {featuredVideo.title}
                  </h4>
                  <p className="mt-1 text-[8px] font-bold text-red-500 uppercase tracking-widest">
                    Watch Now
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;