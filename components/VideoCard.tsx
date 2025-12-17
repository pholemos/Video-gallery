import React from 'react';
import { Play, Clock, Calendar } from 'lucide-react';
import { VideoCardProps } from '../types';

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div 
      onClick={() => onClick(video)}
      className="group relative w-full overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] hover:border-cyan-400/50"
    >
      {/* Glass Highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30 pointer-events-none" />

      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img 
          src={video.thumb} 
          alt={video.title} 
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        
        {/* Dynamic Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />

        {/* Floating Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-2xl transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
            <Play fill="currentColor" className="ml-1 h-7 w-7 text-cyan-400" />
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-0.5 text-[9px] font-bold text-cyan-300 uppercase tracking-widest backdrop-blur-md">
          Featured
        </div>
        
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold text-slate-100 border border-white/10 backdrop-blur-md">
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          {video.duration}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 relative">
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white group-hover:text-cyan-400 transition-colors h-10 tracking-tight">
          {video.title}
        </h3>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>{video.date}</span>
          </div>
          
          <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 w-1/3 group-hover:w-full transition-all duration-1000" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;