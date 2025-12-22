import React, { useMemo } from 'react';
import VideoCard from './VideoCard';
import { VideoData, WallItem, LinkData } from '../types';
import { ExternalLink } from 'lucide-react';

interface VideoWallProps {
  videos: VideoData[];
  onVideoClick: (video: VideoData) => void;
}

const LINKS: LinkData[] = [
  { label: 'Devices', url: 'https://diy-me.com/devices' },
  { label: 'Videos', url: 'https://diy-me.com/videos' },
  { label: 'Resources', url: 'https://diy-me.com/resources' },
  { label: 'Apps', url: 'https://diy-me.com/apps' }
];

const VideoWall: React.FC<VideoWallProps> = ({ videos, onVideoClick }) => {
  const columns = useMemo(() => {
    const cols: WallItem[][] = [[], [], [], []];
    
    videos.forEach((video, idx) => {
      const colIdx = idx % 4;
      
      const items: WallItem[] = [{ type: 'video', content: video }];
      
      // Add a link item periodically for variety
      if (idx % 2 === 0) {
        const linkItem = LINKS[Math.floor(Math.random() * LINKS.length)];
        items.push({ type: 'link', content: linkItem });
      }

      // Shuffle the video and link in this segment
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }

      cols[colIdx].push(...items);
    });

    return cols;
  }, [videos]);

  const renderItem = (item: WallItem, idx: number, colIdx: number) => {
    switch (item.type) {
      case 'video':
        return (
          <div key={`v-${idx}-${colIdx}`} className="mb-6 w-full px-2">
            <VideoCard video={item.content} onClick={onVideoClick} />
          </div>
        );
      case 'link':
        return (
          <div key={`l-${idx}-${colIdx}`} className="mb-6 w-full px-2">
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
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-black flex pause-on-hover">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src="https://raw.githubusercontent.com/doityoumadeeasy-dev/images/ccdb03b87b32be5a5e65e5304a83d71fc83b11f5/Conf/DIY_ME%20Logo.png" 
          alt="DIY ME Logo"
          className="w-[70%] max-w-3xl opacity-[0.15] grayscale brightness-125 contrast-150 mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 grid grid-cols-4 w-full h-full gap-4 px-4">
        {columns.map((colItems, colIdx) => {
          const isUp = colIdx === 0 || colIdx === 2;
          const animationClass = isUp ? 'animate-marquee-up' : 'animate-marquee-down';
          const duration = `${60 + colIdx * 15}s`;
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

      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent via-50% to-black opacity-80 pointer-events-none z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent via-50% to-black opacity-60 pointer-events-none z-20" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default VideoWall;