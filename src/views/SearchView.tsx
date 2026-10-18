import React, { useState, useMemo, useEffect } from 'react';
import { MEDIA_ITEMS, LIVE_CHANNELS } from '../data/mockData';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { useStreaming } from '../context/StreamingContext';
import { Search, X, History, Sparkles, Filter, Radio, Film, Tv } from 'lucide-react';

interface SearchViewProps {
  onOpenDetails: (item: MediaItem) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onOpenDetails }) => {
  const { navigate } = useStreaming();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'series' | 'live'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  // Recent Search History in localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumen_recent_searches');
      return saved ? JSON.parse(saved) : ['Chronos', 'Station Athena', 'Sci-Fi'];
    } catch {
      return ['Chronos', 'Station Athena', 'Sci-Fi'];
    }
  });

  const popularSearches = ['Chronos: The Broken Horizon', 'Celestial Odyssey', 'Neon Horizon', 'Titan', 'Live TV'];

  const handleSearchSubmit = (searchWord: string) => {
    if (!searchWord.trim()) return;
    const clean = searchWord.trim();
    setQuery(clean);
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      localStorage.setItem('lumen_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('lumen_recent_searches');
  };

  const removeSearchItem = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== itemToRemove);
      localStorage.setItem('lumen_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  // Filtered Results
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();

    // If searching live TV specifically
    if (typeFilter === 'live') {
      return [];
    }

    return MEDIA_ITEMS.filter((item) => {
      // Type matching
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // Genre matching
      if (selectedGenre !== 'All' && !item.genres.includes(selectedGenre)) return false;

      // Query matching
      if (!q) return true;

      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const castMatch = item.cast.some((actor) => actor.toLowerCase().includes(q));
      const directorMatch = item.director.toLowerCase().includes(q);
      const genreMatch = item.genres.some((g) => g.toLowerCase().includes(q));

      return titleMatch || descMatch || castMatch || directorMatch || genreMatch;
    });
  }, [query, typeFilter, selectedGenre]);

  // Matching Live Channels
  const liveChannelsMatch = useMemo(() => {
    if (typeFilter === 'movie' || typeFilter === 'series') return [];
    const q = query.toLowerCase().trim();
    if (!q) return typeFilter === 'live' ? LIVE_CHANNELS : [];
    return LIVE_CHANNELS.filter(
      (ch) =>
        ch.name.toLowerCase().includes(q) ||
        ch.category.toLowerCase().includes(q) ||
        ch.currentProgram.title.toLowerCase().includes(q)
    );
  }, [query, typeFilter]);

  const allGenres = ['All', 'Sci-Fi', 'Thriller', 'Mystery', 'Cyberpunk', 'Adventure', 'Drama'];

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Search Header & Large Glass Input */}
      <div className="max-w-3xl mx-auto space-y-4 text-center">
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore the Library
        </h1>
        <p className="text-slate-400 text-sm">
          Search thousands of hours of original cinema, episodic series, cast members, and live streams.
        </p>

        {/* Search Input Box */}
        <div className="relative mt-6">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-cyan-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit(query);
            }}
            placeholder="Search by title, director, actor, or genre..."
            className="w-full pl-14 pr-12 py-4 rounded-3xl glass-panel-elevated border border-white/20 text-white placeholder-slate-500 text-base focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'movie', label: 'Movies' },
            { id: 'series', label: 'Series' },
            { id: 'live', label: 'Live TV' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'glass-panel text-slate-400 hover:text-white border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zero Query State: Suggestions & History */}
      {!query && (
        <div className="max-w-3xl mx-auto space-y-6 pt-2">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-5 rounded-2xl glass-panel border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={clearRecentHistory}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear History
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearchSubmit(item)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-pill text-xs text-slate-200 hover:text-cyan-300 hover:border-cyan-400/30 transition-all group"
                  >
                    <span>{item}</span>
                    <span
                      onClick={(e) => removeSearchItem(item, e)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trending Searches on LUMEN</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearchSubmit(item)}
                  className="px-3.5 py-1.5 rounded-xl glass-panel border border-white/10 text-xs text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {query && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-white">
              Search Results for <span className="text-cyan-300">"{query}"</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {searchResults.length + liveChannelsMatch.length} Results
            </span>
          </div>

          {/* Live Channels Results */}
          {liveChannelsMatch.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-cyan-400">
                Live Channels Matching
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {liveChannelsMatch.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => navigate('live-tv')}
                    className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-400 text-slate-950 font-display font-black flex items-center justify-center text-xs">
                        {ch.logoText}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold text-white">{ch.name}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold">
                            LIVE
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{ch.currentProgram.title}</p>
                      </div>
                    </div>
                    <Radio className="w-4 h-4 text-cyan-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Items Grid */}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {searchResults.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onOpenDetails={onOpenDetails}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {searchResults.length === 0 && liveChannelsMatch.length === 0 && (
            <div className="py-20 text-center glass-panel rounded-3xl border border-white/10 max-w-lg mx-auto">
              <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg text-white mb-1">
                No matching results found
              </h3>
              <p className="text-sm text-slate-400">
                We couldn't find any media matching "{query}". Try searching for keywords like "Chronos", "Sci-Fi", or "Space".
              </p>
              <button
                onClick={() => setQuery('')}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/10 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
