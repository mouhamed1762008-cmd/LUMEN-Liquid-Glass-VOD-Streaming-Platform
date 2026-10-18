import React, { useState } from 'react';
import { MediaItem } from '../types';
import { useStreaming } from '../context/StreamingContext';
import { Play, Info, Plus, Check, Star, Volume2, VolumeX } from 'lucide-react';

interface HeroBannerProps {
  item: MediaItem;
  onOpenDetails: (item: MediaItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ item, onOpenDetails }) => {
  const { navigate, toggleWatchlist, isInWatchlist } = useStreaming();
  const [isMuted, setIsMuted] = useState(true);
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  const inWatchlist = isInWatchlist(item.id);

  const handlePlay = () => {
    navigate('watch', { id: item.id });
  };

  return (
    <div className="relative w-full min-h-[75vh] md:min-h-[85vh] flex items-end overflow-hidden pb-16 pt-28">
      {/* Background Media Container */}
      <div className="absolute inset-0 z-0">
        {!showVideoPreview ? (
          <img
            src={item.backdropUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000"
          />
        ) : (
          <video
            src={item.trailerUrl || item.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover object-center"
          />
        )}

        {/* Ambient Color and Scrim Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070c] via-[#05070c]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070c]/50 via-transparent to-[#05070c]" />

        {/* Dynamic Electric Cyan Atmospheric Flare */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />
      </div>

      {/* Hero Content Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full flex flex-col items-start">
        {/* Apple-grade glass badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>LUMEN Original Premiere</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-3xl drop-shadow-2xl">
          {item.title}
        </h1>

        {/* Unboxed Metadata (Zero-Pill discipline) */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-slate-300 my-3 font-medium">
          <span className="flex items-center gap-1 text-amber-300 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-300" />
            <span className="tabular-nums font-mono">{item.score.toFixed(1)}</span>
          </span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span>{item.releaseYear}</span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span className="border border-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-200">
            {item.rating}
          </span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span>{item.duration}</span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span className="text-cyan-300 font-medium">{item.genres.join(', ')}</span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span className="text-slate-400">Ultra HD 4K · Dolby Atmos</span>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-300/90 max-w-2xl line-clamp-3 sm:line-clamp-none font-normal leading-relaxed mb-6 drop-shadow">
          {item.description}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_4px_24px_rgba(255,255,255,0.25)]"
          >
            <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            <span>Play Now</span>
          </button>

          <button
            onClick={() => onOpenDetails(item)}
            className="flex items-center gap-2 px-5 py-3 rounded-full glass-panel border border-white/15 text-white hover:text-cyan-300 hover:border-white/30 text-sm font-medium transition-all hover:scale-105 active:scale-95"
          >
            <Info className="w-4 h-4" />
            <span>More Details</span>
          </button>

          <button
            onClick={() => toggleWatchlist(item.id, item.title)}
            className={`w-11 h-11 rounded-full glass-panel flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              inWatchlist
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'border-white/15 text-white hover:border-white/35'
            }`}
            title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            aria-label="Add to Watchlist"
          >
            {inWatchlist ? <Check className="w-5 h-5 text-cyan-300" /> : <Plus className="w-5 h-5" />}
          </button>

          {/* Toggle Trailer Preview */}
          <button
            onClick={() => {
              setShowVideoPreview(!showVideoPreview);
              setIsMuted(false);
            }}
            className="px-4 py-3 rounded-full glass-panel border border-white/10 hover:border-white/25 text-xs text-slate-300 hover:text-white transition-all hidden lg:flex items-center gap-2"
          >
            <span>{showVideoPreview ? 'Show Poster' : 'Preview Trailer'}</span>
          </button>
        </div>
      </div>

      {/* Floating Audio Toggle for Trailer */}
      {showVideoPreview && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-16 right-8 z-20 w-10 h-10 rounded-full glass-panel border border-white/20 text-white flex items-center justify-center hover:scale-105 transition-transform"
          aria-label={isMuted ? 'Unmute trailer' : 'Mute trailer'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
};
