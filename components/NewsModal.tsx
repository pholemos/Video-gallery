import React from 'react';
import { X, Newspaper, Zap } from 'lucide-react';
import { NewsData } from '../types';

interface NewsModalProps {
  news: NewsData | null;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ news, onClose }) => {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-black/60 transition-all">
      <div 
        className="relative w-full max-w-lg animate-in zoom-in-95 fade-in duration-300 rounded-3xl border border-blue-500/30 bg-slate-950 p-8 shadow-2xl shadow-blue-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-500">
            <Newspaper className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Official HA Update</span>
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-blue-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{news.source}</span>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-black leading-tight text-white uppercase tracking-tight">
          {news.headline}
        </h2>

        <div className="mb-8 space-y-4">
          <p className="text-lg leading-relaxed text-slate-300">
            {news.detail}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-6">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Source: home-assistant.io
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all hover:-translate-y-0.5"
          >
            Acknowledge
          </button>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

export default NewsModal;