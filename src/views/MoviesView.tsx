import React, { useState, useMemo } from 'react';
import { MEDIA_ITEMS } from '../data/mockData';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import { HeroBanner } from '../components/HeroBanner';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface MoviesViewProps {
  onOpenDetails: (item: MediaItem) => void;
}

export const MoviesView: React.FC<MoviesViewProps> = ({ onOpenDetails }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');

  const allMovies = useMemo(() => MEDIA_ITEMS.filter((m) => m.type === 'movie'), []);
  const featuredMovie = allMovies[0];

  const genres = ['All', 'Sci-Fi', 'Thriller', 'Adventure', 'Mystery', 'Quantum', 'Documentary'];

  const filteredMovies = useMemo(() => {
    let result = allMovies;
    if (selectedGenre !== 'All') {
      result = result.filter((m) => m.genres.includes(selectedGenre));
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'rating') return b.score - a.score;
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      return a.title.localeCompare(b.title);
    });
  }, [allMovies, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen pb-24">
      {/* Featured Movie Spotlight */}
      <HeroBanner item={featuredMovie} onOpenDetails={onOpenDetails} />

      {/* Main Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4 space-y-6">
        {/* Controls Toolbar (Domain-native segmented filter buttons) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-3 rounded-2xl glass-panel border border-white/10">
          {/* Genre Segmented Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            {genres.map((genre) => {
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort by:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-white/15 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="rating">Highest Rated</option>
              <option value="year">Newest Release</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              {selectedGenre === 'All' ? 'All Feature Films' : `${selectedGenre} Movies`}
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'Title' : 'Titles'}
            </span>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredMovies.map((movie) => (
                <MediaCard
                  key={movie.id}
                  item={movie}
                  onOpenDetails={onOpenDetails}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center glass-panel rounded-3xl border border-white/10">
              <p className="text-slate-400 text-sm">No movies found matching "{selectedGenre}".</p>
              <button
                onClick={() => setSelectedGenre('All')}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 border border-cyan-400/30"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
