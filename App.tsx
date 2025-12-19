import React, { useState, useMemo } from 'react';
import VideoWall from './components/VideoWall';
import Hero from './components/Hero';
import SearchResults from './components/SearchResults';
import NewsModal from './components/NewsModal';
import { VideoData, NewsData } from './types';
import { VIDEO_DATA } from './constants';

type AppView = 'landing' | 'results';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<AppView>('landing');
  const [selectedNews, setSelectedNews] = useState<NewsData | null>(null);

  const filteredVideos = useMemo(() => {
    return VIDEO_DATA.filter(video => {
      return video.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  const handleVideoClick = (video: VideoData) => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank', 'noopener,noreferrer');
  };

  const handleNewsClick = (news: NewsData) => {
    setSelectedNews(news);
  };

  const handleSearchEnter = () => {
    setView('results');
  };

  const handleBackToLanding = () => {
    setView('landing');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Floating Wall - Only interactive if not in results view */}
      <div className={view === 'results' ? 'blur-md pointer-events-none' : ''}>
        <VideoWall 
          videos={filteredVideos} 
          onVideoClick={handleVideoClick} 
          onNewsClick={handleNewsClick}
        />
      </div>

      {/* Hero Content Overlay with Search - Hide if in results view */}
      {view === 'landing' && (
        <Hero 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultsCount={filteredVideos.length}
          onEnter={handleSearchEnter}
        />
      )}

      {/* Dedicated Results List View */}
      {view === 'results' && (
        <SearchResults 
          videos={filteredVideos}
          query={searchQuery}
          onBack={handleBackToLanding}
          onVideoClick={handleVideoClick}
        />
      )}

      {/* News Detail Modal */}
      <NewsModal 
        news={selectedNews} 
        onClose={() => setSelectedNews(null)} 
      />
    </div>
  );
};

export default App;