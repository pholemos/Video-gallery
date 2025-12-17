import React from 'react';
import { Youtube, Search, X } from 'lucide-react';

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
  const isFiltered = searchQuery !== '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEnter();
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

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pointer-events-auto">
          <a 
            href="https://www.youtube.com/@diymadeeasy1824?sub_confirmation=1" 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full bg-red-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 hover:shadow-red-600/40 hover:-translate-y-1"
          >
            <Youtube className="h-5 w-5 fill-current" />
            <span className="uppercase tracking-widest">Subscribe</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;