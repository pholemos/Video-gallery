import React from 'react';
import { Play, Calendar } from 'lucide-react';
import { VideoCardProps } from '../types';

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <div 
      onClick={() => onClick(video)}
      className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 border-2 border-white/20 cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:border-red-600 hover:bg-slate-800"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <img 
          src={video.thumb} 
          alt={video.title} 
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-100"
        />
        
        {/* Play Icon - Red Theme */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/40 backdrop-blur-md text-white border-2 border-red-500 transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-red-600/40">
            <Play fill="currentColor" className="ml-1 h-6 w-6 text-white" />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 rounded bg-black/90 px-2 py-1 text-[11px] font-black text-white border border-white/10 backdrop-blur-sm">
          {video.duration}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 bg-slate-900">
        <h3 className="line-clamp-2 text-sm font-black text-white group-hover:text-red-500 transition-colors h-10 leading-tight uppercase tracking-tight">
          {video.title}
        </h3>
        
        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-300 font-bold uppercase tracking-widest border-t border-white/5 pt-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-red-500" />
            <span>{video.date}</span>
          </div>
          <span className="text-red-600 group-hover:text-red-500 transition-colors">Watch Now</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;