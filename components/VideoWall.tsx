import React, { useMemo, useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import { VideoData, WallItem, LinkData, NewsData } from '../types';
import { ExternalLink, Newspaper, Zap } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

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

const DEFAULT_NEWS: NewsData[] = [
  { headline: "Home Assistant 2025.1: New Voice features released", source: "HA Blog" },
  { headline: "Matter 1.4 expands smart home compatibility", source: "TechDaily" },
  { headline: "Nabu Casa announces new hardware tier", source: "SmartHome News" },
  { headline: "Local AI: Why it's the future of automation", source: "DIY Tech" }
];

const VideoWall: React.FC<VideoWallProps> = ({ videos, onVideoClick }) => {
  const [news, setNews] = useState<NewsData[]>(DEFAULT_NEWS);

  useEffect(() => {
    const fetchNews = async () => {
      // Defensive check for environment variables
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
      if (!apiKey) {
        console.warn("API Key not found, using default news.");
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Generate 12 short, catchy news headlines about Home Assistant, ESPHome, Zigbee, and smart home automation. Make them sound like current news. For each, provide a short source name.",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  source: { type: Type.STRING },
                },
                required: ["headline", "source"],
              },
            },
          },
        });
        
        let text = response.text || "";
        // Clean markdown if present
        if (text.includes("```json")) {
          text = text.split("```json")[1].split("```")[0].trim();
        } else if (text.includes("```")) {
          text = text.split("```")[1].split("```")[0].trim();
        }

        if (text) {
          const parsedNews = JSON.parse(text);
          if (Array.isArray(parsedNews) && parsedNews.length > 0) {
            setNews(parsedNews);
          }
        }
      } catch (error) {
        console.error("Failed to fetch news from Gemini:", error);
      }
    };

    fetchNews();
  }, []);

  const columns = useMemo(() => {
    const cols: WallItem[][] = [[], [], [], []];
    const getRandomLink = () => LINKS[Math.floor(Math.random() * LINKS.length)];

    // Ensure news is never empty to avoid division by zero
    const safeNews = news.length > 0 ? news : DEFAULT_NEWS;

    videos.forEach((video, idx) => {
      const colIdx = idx % 4;
      
      // Add video
      cols[colIdx].push({ type: 'video', content: video });
      
      // Add news between video and link
      const newsItem = safeNews[idx % safeNews.length];
      cols[colIdx].push({ type: 'news', content: newsItem });
      
      // Add link
      cols[colIdx].push({ 
        type: 'link', 
        content: getRandomLink()
      });
    });

    return cols;
  }, [videos, news]);

  const renderItem = (item: WallItem, idx: number, colIdx: number) => {
    switch (item.type) {
      case 'video':
        return (
          <div key={`v-${item.content.id}-${colIdx}-${idx}`} className="mb-6 w-full px-2">
            <VideoCard video={item.content} onClick={onVideoClick} />
          </div>
        );
      case 'link':
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
      case 'news':
        return (
          <div key={`n-${idx}-${colIdx}`} className="mb-6 w-full px-2">
            <div className="group relative w-full rounded-2xl border-2 border-blue-500/40 bg-slate-900/60 p-5 backdrop-blur-xl transition-all hover:border-blue-400 hover:bg-slate-800/80 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="absolute -top-2 -left-2 rounded bg-blue-600 px-2 py-0.5 text-[8px] font-black text-white uppercase tracking-tighter flex items-center gap-1 shadow-lg">
                <Newspaper className="h-2 w-2" />
                Latest News
              </div>
              <p className="text-sm font-bold leading-tight text-white/90 group-hover:text-white transition-colors">
                {item.content.headline}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    {item.content.source}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Just Now</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-black flex pause-on-hover">
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src="https://raw.githubusercontent.com/doityoumadeeasy-dev/images/ccdb03b87b32be5a5e65e5304a83d71fc83b11f5/Conf/DIY_ME%20Logo.png" 
          alt="DIY ME Logo"
          className="w-[70%] max-w-3xl opacity-[0.15] grayscale brightness-125 contrast-150 mix-blend-overlay"
        />
      </div>

      {/* Main Grid with 4 columns */}
      <div className="relative z-10 grid grid-cols-4 w-full h-full gap-4 px-4">
        {columns.map((colItems, colIdx) => {
          const isUp = colIdx === 0 || colIdx === 2; // 1st and 3rd go up
          const animationClass = isUp ? 'animate-marquee-up' : 'animate-marquee-down';
          const duration = `${50 + colIdx * 12}s`;

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

      {/* Depth Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent via-50% to-black opacity-80 pointer-events-none z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent via-50% to-black opacity-60 pointer-events-none z-20" />
      
      {/* Dynamic scanline/grain effect */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default VideoWall;