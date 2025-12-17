export interface VideoData {
  id: string;
  title: string;
  duration: string;
  thumb: string;
  date: string;
}

export interface VideoCardProps {
  video: VideoData;
  onClick: (video: VideoData) => void;
}

export interface MarqueeColumnProps {
  videos: VideoData[];
  direction: 'up' | 'down';
  duration?: string;
  onVideoClick: (video: VideoData) => void;
}
