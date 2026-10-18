import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ViewingProgress, ToastMessage, ReactionType } from '../types';

interface StreamingContextType {
  user: UserProfile;
  setUserName: (name: string) => void;
  setUserAvatar: (avatarId: string) => void;
  updateUserPreferences: (prefs: Partial<UserProfile>) => void;
  completeOnboarding: (name: string, avatarId: string) => void;
  
  // Watchlist & Favorites
  watchlist: string[];
  toggleWatchlist: (id: string, title?: string) => void;
  isInWatchlist: (id: string) => boolean;
  
  favorites: string[];
  toggleFavorite: (id: string, title?: string) => void;
  isFavorite: (id: string) => boolean;

  // Reactions
  reactions: Record<string, ReactionType>;
  setReaction: (id: string, reaction: ReactionType) => void;

  // Continue Watching & History
  continueWatching: Record<string, ViewingProgress>;
  saveProgress: (mediaId: string, currentTime: number, duration: number, seasonNumber?: number, episodeNumber?: number) => void;
  clearHistory: () => void;
  removeFromContinueWatching: (mediaId: string) => void;

  // Live Channels
  favoriteChannels: string[];
  toggleFavoriteChannel: (channelId: string) => void;
  isFavoriteChannel: (channelId: string) => boolean;

  // Navigation
  currentRoute: string;
  routeParams: { id?: string; season?: number; episode?: number };
  navigate: (route: string, params?: { id?: string; season?: number; episode?: number }) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'cyan') => void;
  removeToast: (id: string) => void;
}

const DEFAULT_USER: UserProfile = {
  name: '',
  avatar: 'cyan-cyber',
  autoplayNext: true,
  preferredQuality: 'Auto (4K HDR)',
  preferredLanguage: 'English (Original)',
  hasOnboarded: false,
};

const DEFAULT_WATCHLIST: string[] = ['celestial-odyssey', 'chronos-protocol'];
const DEFAULT_FAVORITES: string[] = ['chronos-protocol'];
const DEFAULT_CONTINUE_WATCHING: Record<string, ViewingProgress> = {
  'celestial-odyssey': {
    mediaId: 'celestial-odyssey',
    currentTime: 2350,
    duration: 3360,
    lastWatched: new Date().toISOString(),
    seasonNumber: 1,
    episodeNumber: 1,
  },
  'chronos-protocol': {
    mediaId: 'chronos-protocol',
    currentTime: 3840,
    duration: 8160,
    lastWatched: new Date().toISOString(),
  },
};

const StreamingContext = createContext<StreamingContextType | undefined>(undefined);

export const StreamingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('lumen_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Watchlist
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumen_watchlist');
      return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumen_favorites');
      return saved ? JSON.parse(saved) : DEFAULT_FAVORITES;
    } catch {
      return DEFAULT_FAVORITES;
    }
  });

  // Reactions
  const [reactions, setReactions] = useState<Record<string, ReactionType>>(() => {
    try {
      const saved = localStorage.getItem('lumen_reactions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Continue Watching
  const [continueWatching, setContinueWatching] = useState<Record<string, ViewingProgress>>(() => {
    try {
      const saved = localStorage.getItem('lumen_continue_watching');
      return saved ? JSON.parse(saved) : DEFAULT_CONTINUE_WATCHING;
    } catch {
      return DEFAULT_CONTINUE_WATCHING;
    }
  });

  // Favorite Channels
  const [favoriteChannels, setFavoriteChannels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumen_fav_channels');
      return saved ? JSON.parse(saved) : ['ch-lumen-one'];
    } catch {
      return ['ch-lumen-one'];
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation State with URL parsing
  const getInitialRoute = () => {
    const path = window.location.pathname.replace(/^\//, '');
    if (!path || path === '') {
      return user.hasOnboarded ? 'home' : 'welcome';
    }
    const parts = path.split('/');
    if (parts[0] === 'details' && parts[1]) {
      return 'details';
    }
    if (parts[0] === 'watch' && parts[1]) {
      return 'watch';
    }
    return parts[0] || (user.hasOnboarded ? 'home' : 'welcome');
  };

  const getInitialParams = () => {
    const path = window.location.pathname.replace(/^\//, '');
    const parts = path.split('/');
    if ((parts[0] === 'details' || parts[0] === 'watch') && parts[1]) {
      return { id: parts[1] };
    }
    return {};
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [routeParams, setRouteParams] = useState<{ id?: string; season?: number; episode?: number }>(getInitialParams);

  // Sync route with window popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      const parts = path.split('/');
      const route = parts[0] || (user.hasOnboarded ? 'home' : 'welcome');
      setCurrentRoute(route);
      if ((route === 'details' || route === 'watch') && parts[1]) {
        setRouteParams({ id: parts[1] });
      } else {
        setRouteParams({});
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user.hasOnboarded]);

  const navigate = (route: string, params?: { id?: string; season?: number; episode?: number }) => {
    setCurrentRoute(route);
    setRouteParams(params || {});
    let path = `/${route}`;
    if (params?.id && (route === 'details' || route === 'watch')) {
      path = `/${route}/${params.id}`;
    }
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('lumen_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lumen_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('lumen_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('lumen_reactions', JSON.stringify(reactions));
  }, [reactions]);

  useEffect(() => {
    localStorage.setItem('lumen_continue_watching', JSON.stringify(continueWatching));
  }, [continueWatching]);

  useEffect(() => {
    localStorage.setItem('lumen_fav_channels', JSON.stringify(favoriteChannels));
  }, [favoriteChannels]);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'info' | 'cyan' = 'cyan') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setUserName = (name: string) => {
    setUser((prev) => ({ ...prev, name }));
  };

  const setUserAvatar = (avatar: string) => {
    setUser((prev) => ({ ...prev, avatar }));
  };

  const updateUserPreferences = (prefs: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...prefs }));
    showToast('Preferences updated', 'success');
  };

  const completeOnboarding = (name: string, avatarId: string) => {
    setUser({
      ...user,
      name: name.trim() || 'Explorer',
      avatar: avatarId || 'cyan-cyber',
      hasOnboarded: true,
    });
    showToast(`Welcome to LUMEN, ${name || 'Explorer'}!`, 'cyan');
    navigate('home');
  };

  const toggleWatchlist = (id: string, title?: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(
        exists ? `Removed ${title || 'title'} from Watchlist` : `Added ${title || 'title'} to Watchlist`,
        exists ? 'info' : 'success'
      );
      return updated;
    });
  };

  const isInWatchlist = (id: string) => watchlist.includes(id);

  const toggleFavorite = (id: string, title?: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(
        exists ? `Removed from Favorites` : `Added to Favorites`,
        exists ? 'info' : 'success'
      );
      return updated;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const setReaction = (id: string, reaction: ReactionType) => {
    setReactions((prev) => {
      const current = prev[id];
      const next = current === reaction ? null : reaction;
      if (next === 'like') showToast('Added to liked titles', 'success');
      return { ...prev, [id]: next };
    });
  };

  const saveProgress = (
    mediaId: string,
    currentTime: number,
    duration: number,
    seasonNumber?: number,
    episodeNumber?: number
  ) => {
    if (!duration || duration <= 0) return;
    setContinueWatching((prev) => ({
      ...prev,
      [mediaId]: {
        mediaId,
        currentTime,
        duration,
        lastWatched: new Date().toISOString(),
        seasonNumber,
        episodeNumber,
      },
    }));
  };

  const removeFromContinueWatching = (mediaId: string) => {
    setContinueWatching((prev) => {
      const copy = { ...prev };
      delete copy[mediaId];
      return copy;
    });
    showToast('Removed from Continue Watching', 'info');
  };

  const clearHistory = () => {
    setContinueWatching({});
    showToast('Viewing history cleared', 'info');
  };

  const toggleFavoriteChannel = (channelId: string) => {
    setFavoriteChannels((prev) => {
      const exists = prev.includes(channelId);
      const updated = exists ? prev.filter((id) => id !== channelId) : [...prev, channelId];
      showToast(
        exists ? 'Channel removed from favorites' : 'Channel saved to favorites',
        'cyan'
      );
      return updated;
    });
  };

  const isFavoriteChannel = (channelId: string) => favoriteChannels.includes(channelId);

  return (
    <StreamingContext.Provider
      value={{
        user,
        setUserName,
        setUserAvatar,
        updateUserPreferences,
        completeOnboarding,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        favorites,
        toggleFavorite,
        isFavorite,
        reactions,
        setReaction,
        continueWatching,
        saveProgress,
        clearHistory,
        removeFromContinueWatching,
        favoriteChannels,
        toggleFavoriteChannel,
        isFavoriteChannel,
        currentRoute,
        routeParams,
        navigate,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StreamingContext.Provider>
  );
};

export const useStreaming = () => {
  const context = useContext(StreamingContext);
  if (!context) {
    throw new Error('useStreaming must be used within a StreamingProvider');
  }
  return context;
};
