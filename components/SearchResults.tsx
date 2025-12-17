import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import VideoCard from './VideoCard';
import { VideoData } from '../types';

interface SearchResultsProps {
  videos: VideoData[];
  query: string;
  onBack: () => void;
  onVideoClick: (video: VideoData) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  videos, 
  query, 
  onBack, 
  onVideoClick 
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-red-900/30 pb-8 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <button 
              onClick={onBack}
              className="group mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-red-500"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Explore
            </button>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Search Results
            </h1>
            <p className="flex items-center gap-2 text-slate-400">
              <Search className="h-4 w-4 text-red-500" />
              Showing {videos.length} videos for "<span className="text-red-400">{query}</span>"
            </p>
          </div>
          
          <button 
            onClick={onBack}
            className="rounded-full border border-red-600/50 bg-red-900/20 px-6 py-2 text-sm font-bold uppercase tracking-widest text-red-400 transition-all hover:bg-red-600 hover:text-white"
          >
            New Search
          </button>
        </div>

        {/* Grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <div key={video.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <VideoCard video={video} onClick={onVideoClick} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-slate-800/50 p-8">
              <Search className="h-16 w-16 text-slate-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white uppercase">No tutorials found</h2>
            <p className="max-w-md text-slate-400">
              We couldn't find any videos matching your search. Try different keywords or browse our full collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;