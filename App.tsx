import React, { useState, useMemo } from 'react';
import VideoWall from './components/VideoWall';
import Hero from './components/Hero';
import { VideoData } from './types';
import { VIDEO_DATA } from './constants';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = useMemo(() => {
    return VIDEO_DATA.filter(video => {
      return video.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  const handleVideoClick = (video: VideoData) => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-900 text-white">
      {/* Background Floating Wall */}
      <VideoWall 
        videos={filteredVideos} 
        onVideoClick={handleVideoClick} 
      />

      {/* Hero Content Overlay with Search */}
      <Hero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsCount={filteredVideos.length}
      />
    </div>
  );
};

export default App;