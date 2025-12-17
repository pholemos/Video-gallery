import React, { useMemo } from 'react';
import VideoCard from './VideoCard';
import { VideoData, WallItem, LinkData } from '../types';
import { ExternalLink } from 'lucide-react';

interface VideoWallProps {
  videos: VideoData[];
  onVideoClick: (video: VideoData) => void;
}

const LINKS: LinkData[] = [
  { label: 'Products', url: 'https://diy-me.com/products' },
  { label: 'Videos', url: 'https://diy-me.com/videos' },
  { label: 'Resources', url: 'https://diy-me.com/resources' },
  { label: 'Apps', url: 'https://diy-me.com/apps' }
];

const VideoWall: React.FC<VideoWallProps> = ({ videos, onVideoClick }) => {
  const columns = useMemo(() => {
    // Create 4 empty columns
    const cols: WallItem[][] = [[], [], [], []];
    
    // Function to get a random link
    const getRandomLink = () => LINKS[Math.floor(Math.random() * LINKS.length)];

    // Distribute videos and insert a RANDOM link AFTER every video in its column
    videos.forEach((video, idx) => {
      const colIdx = idx % 4;
      
      // Add the video item
      cols[colIdx].push({ type: 'video', content: video });
      
      // Add a random link item immediately after
      cols[colIdx].push({ 
        type: 'link', 
        content: getRandomLink()
      });
    });

    return cols;
  }, [videos]);

  const renderItem = (item: WallItem, idx: number, colIdx: number) => {
    if (item.type === 'video') {
      return (
        <div key={`v-${item.content.id}-${colIdx}-${idx}`} className="mb-6 w-full px-2">
          <VideoCard video={item.content} onClick={onVideoClick} />
        </div>
      );
    } else {
      return (
        <div key={`l-${item.content.label}-${colIdx}-${idx}`} className="mb-6 w-full px-2">
          <a
            href={item.content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full rounded-2xl border-2 border-red-600/60 bg-red-950/40 p-5 backdrop-blur-xl transition-all hover:border-red-400 hover:bg-red-600/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-black tracking-widest text-white group-hover:text-red-100 uppercase">
                {item.content.label}
              </span>
              <ExternalLink className="h-4 w-4 text-red-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-red-600/80" />
              <p className="text-[10px] text-red-300 font-bold uppercase tracking-widest">Explore More</p>
            </div>
          </a>
        </div>
      );
    }
  };

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#020617] flex pause-on-hover">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src="https://raw.githubusercontent.com/doityoumadeeasy-dev/images/ccdb03b87b32be5a5e65e5304a83d71fc83b11f5/Conf/DIY_ME%20Logo.png" 
          alt="DIY ME Logo"
          className="w-[70%] max-w-3xl opacity-[0.12] grayscale brightness-125 contrast-125 mix-blend-overlay"
        />
      </div>

      {/* Main Grid with 4 columns */}
      <div className="relative z-10 grid grid-cols-4 w-full h-full gap-4 px-4">
        {columns.map((colItems, colIdx) => {
          const isUp = colIdx === 0 || colIdx === 2; // 1st and 3rd go up
          const animationClass = isUp ? 'animate-marquee-up' : 'animate-marquee-down';
          // Variation in speeds
          const duration = `${40 + colIdx * 10}s`;

          // Double the items for a seamless infinite loop
          const doubledItems = [...colItems, ...colItems];

          return (
            <div key={`col-${colIdx}`} className="relative h-full overflow-hidden">
              <div 
                className={`flex flex-col ${animationClass}`}
                style={{ '--duration': duration } as React.CSSProperties}
              >
                {doubledItems.map((item, itemIdx) => renderItem(item, itemIdx, colIdx))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Depth Overlays with a subtle red tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent via-50% to-[#020617] opacity-60 pointer-events-none z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-red-950/5 via-50% to-[#020617] opacity-40 pointer-events-none z-20" />
      
      {/* Dynamic scanline/grain effect */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default VideoWall;