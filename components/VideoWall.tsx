import React, { useMemo } from 'react';
import VideoCard from './VideoCard';
import { VideoData } from '../types';

interface VideoWallProps {
  videos: VideoData[];
  onVideoClick: (video: VideoData) => void;
}

const VideoWall: React.FC<VideoWallProps> = ({ videos, onVideoClick }) => {
  const cardWidth = 380;
  const numCards = videos.length;

  const carouselSettings = useMemo(() => {
    if (numCards === 0) return { radius: 0, angleStep: 0 };
    
    const angleStep = 360 / numCards;
    const calculatedRadius = (cardWidth / 2) / Math.tan(Math.PI / numCards);
    
    // Maintain a generous radius to see the zig-zag depth clearly
    const radius = Math.max(calculatedRadius, numCards < 5 ? 700 : 1000); 
    
    return { radius, angleStep };
  }, [numCards]);

  const isEmpty = videos.length === 0;

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#020617] scene">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,_var(--tw-gradient-stops))] from-cyan-500/10 via-slate-950/40 to-slate-950 pointer-events-none" />
      
      {/* Requested Logo Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img 
          src="https://raw.githubusercontent.com/doityoumadeeasy-dev/images/ccdb03b87b32be5a5e65e5304a83d71fc83b11f5/Conf/DIY_ME%20Logo.png" 
          alt="DIY ME Logo Background"
          className="w-[80%] max-w-4xl opacity-[0.07] filter grayscale blur-[2px]"
        />
      </div>

      {/* Background star texture */}
      <div 
        className="absolute inset-0 opacity-[0.1] pointer-events-none translate-z-[-1000px]"
        style={{
          backgroundImage: `radial-gradient(circle, #334155 1px, transparent 1px)`,
          backgroundSize: '120px 120px'
        }}
      />

      {isEmpty ? (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center opacity-20">
            <p className="text-4xl font-bold text-slate-500 mb-2 tracking-tighter uppercase">No Signal</p>
            <p className="text-slate-600 font-medium">Try broadening your search criteria</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <div 
            className="carousel-3d animate-rotate-3d flex items-center justify-center"
            style={{ 
              '--duration': `${Math.max(40, numCards * 2.5)}s`,
              transform: 'rotateX(-2deg)' 
            } as React.CSSProperties}
          >
            {videos.map((video, index) => {
              const rotation = index * carouselSettings.angleStep;
              
              // Zig Zag Logic:
              // Alternate between high and low positions
              const zigZagAmount = 140; 
              const isEven = index % 2 === 0;
              const zigZagY = isEven ? -zigZagAmount : zigZagAmount;
              
              // Tilt the card slightly on the Z axis to align with the zig-zag path
              const tiltZ = isEven ? 5 : -5;

              return (
                <div
                  key={`${video.id}-${index}`}
                  className="absolute reflect-card"
                  style={{
                    width: `${cardWidth}px`,
                    transform: `rotateY(${rotation}deg) translateZ(${carouselSettings.radius}px) translateY(${zigZagY}px) rotateZ(${tiltZ}deg)`,
                    backfaceVisibility: 'hidden',
                    willChange: 'transform',
                    transition: 'opacity 0.5s ease, transform 0.5s ease-out'
                  }}
                >
                  <VideoCard video={video} onClick={onVideoClick} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Focal depth overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-transparent to-slate-950/90 pointer-events-none" />
      
      {/* Spotlight on the "Front" card area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
};

export default VideoWall;