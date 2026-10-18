export type MediaType = 'movie' | 'series';

export interface Episode {
  episodeNumber: number;
  title: string;
  duration: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface MediaItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  type: MediaType;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  trailerUrl?: string;
  releaseYear: number;
  rating: string; // e.g. "TV-MA", "PG-13", "R"
  score: number; // e.g. 9.4
  duration: string; // e.g. "2h 18m" or "3 Seasons"
  genres: string[];
  director: string;
  cast: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  seasons?: Season[];
}

export interface ScheduledProgram {
  time: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  isCurrent?: boolean;
  progressPercent?: number;
}

export interface LiveChannel {
  id: string;
  name: string;
  callsign: string;
  category: 'News' | 'Cinema' | 'Sci-Fi' | 'Sports' | 'Documentary';
  logoText: string;
  streamUrl: string;
  currentProgram: {
    title: string;
    episodeTitle?: string;
    time: string;
    progressPercent: number;
    description: string;
  };
  schedule: ScheduledProgram[];
}

export interface UserProfile {
  name: string;
  avatar: string;
  autoplayNext: boolean;
  preferredQuality: 'Auto (4K HDR)' | '1080p HD' | '720p SD';
  preferredLanguage: string;
  hasOnboarded: boolean;
}

export interface ViewingProgress {
  mediaId: string;
  currentTime: number;
  duration: number;
  lastWatched: string;
  seasonNumber?: number;
  episodeNumber?: number;
}

export type ReactionType = 'like' | 'dislike' | null;

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'cyan';
}
