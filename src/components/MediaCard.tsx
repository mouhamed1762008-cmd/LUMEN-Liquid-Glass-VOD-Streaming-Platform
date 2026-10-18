import React, { useState } from 'react';
import { MediaItem } from '../types';
import { useStreaming } from '../context/StreamingContext';
import { Play, Plus, Check, Info, Film, Star } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  aspectRatio?: 'poster' | 'backdrop';
  progressPercent?: number;
  onOpenDetails?: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  aspectRatio = 'poster',
  progressPercent,
  onOpenDetails,
}) => {
  const { navigate, toggleWatchlist, isInWatchlist } = useStreaming();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inWatchlist = isInWatchlist(item.id);
  const displayImage = aspectRatio === 'backdrop' ? item.backdropUrl : item.posterUrl;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('watch', { id: item.id });
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(item.id, item.title);
  };

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(item);
    } else {
      navigate('details', { id: item.id });
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer select-none rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      tabIndex={0}
      role="button"
      aria-label={`View details for ${item.title}`}
    >
      {/* Outer Glass Card Container */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-lg group-hover:border-white/25 group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.7)] transition-all ${
          aspectRatio === 'backdrop' ? 'aspect-[16/9]' : 'aspect-[3/4]'
        }`}
      >
        {/* Poster Image with Fallback Container */}
        {!imgError ? (
          <img
            src={displayImage}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 text-center">
            <Film className="w-10 h-10 text-cyan-400/60 mb-2" />
            <span className="font-display font-semibold text-sm text-slate-200 line-clamp-2">
              {item.title}
            </span>
            <span className="text-xs text-slate-400 mt-1">{item.releaseYear}</span>
          </div>
        )}

        {/* Ambient Glass Highlight Glare on hover */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-cyan-500/0 via-white/[0.04] to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Bottom Gradient Scrim for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />

        {/* Progress Bar for Continue Watching */}
        {typeof progressPercent === 'number' && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_8px_#00f0ff]"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0'
          }`}
        >
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handlePlayClick}
              className="w-9 h-9 rounded-full bg-white text-slate-950 flex items-center justify-center hover:bg-cyan-300 hover:scale-105 active:scale-95 transition-all shadow-lg"
              title="Play Now"
              aria-label={`Play ${item.title}`}
            >
              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            </button>

            <button
              onClick={handleWatchlistClick}
              className={`w-9 h-9 rounded-full glass-panel flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${
                inWatchlist
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/20 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'text-white border-white/20 hover:border-white/40'
              }`}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label="Toggle Watchlist"
            >
              {inWatchlist ? <Check className="w-4 h-4 text-cyan-300" /> : <Plus className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-9 h-9 rounded-full glass-panel text-white border-white/20 hover:border-white/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              title="More Details"
              aria-label="More Details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Always visible title & unboxed metadata when NOT hovered or on mobile */}
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none transition-opacity duration-200 group-hover:opacity-0 md:group-hover:opacity-0">
          <h3 className="font-display font-semibold text-sm text-white truncate drop-shadow-md">
            {item.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
            <span>{item.releaseYear}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>{item.rating}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="tabular-nums font-mono text-[11px]">{item.score.toFixed(1)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Footer (Outside container for clean typography) */}
      <div className="pt-2 px-1">
        <h4 className="font-display font-semibold text-sm text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
          {item.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
          <span>{item.genres[0]}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{item.duration}</span>
        </div>
      </div>
    </div>
  );
};
