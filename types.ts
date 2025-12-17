
// Removed self-import of VideoData to resolve conflict with local declaration.
export interface VideoData {
  id: string;
  title: string;
  duration: string;
  thumb: string;
  date: string;
}

export interface LinkData {
  label: string;
  url: string;
}

export type WallItem = 
  | { type: 'video'; content: VideoData }
  | { type: 'link'; content: LinkData };

export interface VideoCardProps {
  video: VideoData;
  onClick: (video: VideoData) => void;
}