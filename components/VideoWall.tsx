import React, { useMemo, useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import { VideoData, WallItem, LinkData, NewsData } from '../types';
import { ExternalLink, Newspaper, Zap } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface VideoWallProps {
  videos: VideoData[];
  onVideoClick: (video: VideoData) => void;
  onNewsClick: (news: NewsData) => void;
}

const LINKS: LinkData[] = [
  { label: 'Products', url: 'https://diy-me.com/products' },
  { label: 'Videos', url: 'https://diy-me.com/videos' },
  { label: 'Resources', url: 'https://diy-me.com/resources' },
  { label: 'Apps', url: 'https://diy-me.com/apps' }
];

const DEFAULT_NEWS: NewsData[] = [
  { 
    headline: "Home Assistant 2025.1: New Voice features released", 
    source: "HA Blog",
    detail: "The first release of 2025 brings massive improvements to local voice processing. Users can now define custom wake words entirely on-device without needing Nabu Casa cloud services."
  },
  { 
    headline: "Matter 1.4 expands smart home compatibility", 
    source: "TechDaily",
    detail: "The Connectivity Standards Alliance has officially launched Matter 1.4, adding support for energy management systems and complex multi-admin scenarios for mixed-brand environments."
  },
  { 
    headline: "Nabu Casa announces new hardware tier", 
    source: "SmartHome News",
    detail: "A new powerful Home Assistant controller has been teased by Nabu Casa, featuring an integrated NPU for local AI tasks and expanded Zigbee/Thread antenna arrays."
  }
];

const VideoWall: React.FC<VideoWallProps> = ({ videos, onVideoClick, onNewsClick }) => {
  const [news, setNews] = useState<NewsData[]>(DEFAULT_NEWS);

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
      if (!apiKey) return;

      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Generate 15 short, catchy news headlines about Home Assistant, ESPHome, Zigbee, and smart home automation. For each item, provide: 1) A headline, 2) A short source name, 3) A 2-3 sentence detail paragraph about the news for a popup. Return valid JSON.",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  source: { type: Type.STRING },
                  detail: { type: Type.STRING },
                },
                required: ["headline", "source", "detail"],
              },
            },
          },
        });
        
        let text = response.text || "";
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
        console.error("Failed to fetch news:", error);
      }
    };

    fetchNews();
  }, []);

  const columns = useMemo(() => {
    const cols: WallItem[][] = [[], [], [], []];
    const safeNews = news.length > 0 ? news : DEFAULT_NEWS;
    
    // Create a pool of items to distribute
    const newsPool = [...safeNews];
    const linkPool = [...LINKS];
    
    videos.forEach((video, idx) => {
      const colIdx = idx % 4;
      
      // Items for this "row" in the column
      const items: WallItem[] = [{ type: 'video', content: video }];
      
      // Add a news item
      const newsItem = newsPool[Math.floor(Math.random() * newsPool.length)];
      items.push({ type: 'news', content: newsItem });
      
      // Add a link item
      const linkItem = LINKS[Math.floor(Math.random() * LINKS.length)];
      items.push({ type: 'link', content: linkItem });

      // SHUFFLE the items for this specific segment to make it random
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }

      cols[colIdx].push(...items);
    });

    return cols;
  }, [videos, news]);

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
      case 'news':
        return (
          <div key={`n-${idx}-${colIdx}`} className="mb-6 w-full px-2">
            <div 
              onClick={() => onNewsClick(item.content)}
              className="group relative w-full cursor-pointer rounded-2xl border-2 border-blue-500/40 bg-slate-900/60 p-5 backdrop-blur-xl transition-all hover:border-blue-400 hover:bg-slate-800/80 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02]"
            >
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
                <span className="text-[9px] font-bold text-slate-500 uppercase">Read Story</span>
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