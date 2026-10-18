import React, { useState } from 'react';
import { MediaItem } from '../types';
import { useStreaming } from '../context/StreamingContext';
import { MEDIA_ITEMS } from '../data/mockData';
import { MediaCard } from './MediaCard';
import {
  X,
  Play,
  Plus,
  Check,
  ThumbsUp,
  ThumbsDown,
  Star,
  Film,
  Sparkles,
  Share2,
} from 'lucide-react';

interface DetailsModalProps {
  mediaId: string;
  onClose: () => void;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({ mediaId, onClose }) => {
  const {
    navigate,
    toggleWatchlist,
    isInWatchlist,
    reactions,
    setReaction,
    showToast,
  } = useStreaming();

  const item = MEDIA_ITEMS.find((m) => m.id === mediaId) || MEDIA_ITEMS[0];
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes' | 'similar'>('overview');

  const inWatchlist = isInWatchlist(item.id);
  const currentReaction = reactions[item.id];

  const handlePlay = (episodeNumber?: number) => {
    navigate('watch', { id: item.id, season: selectedSeason, episode: episodeNumber || 1 });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard', 'cyan');
  };

  // Find similar items
  const similarItems = MEDIA_ITEMS.filter(
    (m) => m.id !== item.id && (m.genres.some((g) => item.genres.includes(g)) || m.type === item.type)
  ).slice(0, 4);

  const activeSeasonData = item.seasons?.find((s) => s.seasonNumber === selectedSeason);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop Dismiss Target */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Main Glass Dialog */}
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden glass-panel-elevated border border-white/15 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full glass-panel border border-white/20 text-slate-300 hover:text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto no-scrollbar flex-1">
          {/* Hero Backdrop in Modal */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden">
            <img
              src={item.backdropUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e18] via-[#0a0e18]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e18] via-transparent to-transparent" />

            {/* Quick Hero Floating Info */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div className="max-w-2xl">
                <span className="text-xs uppercase tracking-widest font-semibold text-cyan-300">
                  {item.type === 'series' ? 'Original Television Series' : 'LUMEN Feature Film'}
                </span>
                <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-1">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-cyan-200/90 font-medium italic mt-1">
                  "{item.tagline}"
                </p>
              </div>

              {/* Action Buttons Top */}
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => handlePlay()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-all hover:scale-105 shadow-lg"
                >
                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  <span>Play</span>
                </button>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            {/* Action Bar & Quick Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePlay()}
                  className="sm:hidden flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-950 font-semibold text-sm"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Play</span>
                </button>

                <button
                  onClick={() => toggleWatchlist(item.id, item.title)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs font-medium border transition-all ${
                    inWatchlist
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-500/20'
                      : 'border-white/15 text-slate-200 hover:text-white'
                  }`}
                >
                  {inWatchlist ? <Check className="w-3.5 h-3.5 text-cyan-300" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{inWatchlist ? 'In Watchlist' : 'Watchlist'}</span>
                </button>

                {/* Reaction Toggles */}
                <div className="flex items-center gap-1 glass-panel px-2 py-1 rounded-full border border-white/10">
                  <button
                    onClick={() => setReaction(item.id, 'like')}
                    className={`p-1.5 rounded-full transition-colors ${
                      currentReaction === 'like' ? 'text-cyan-300 bg-cyan-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Like"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setReaction(item.id, 'dislike')}
                    className={`p-1.5 rounded-full transition-colors ${
                      currentReaction === 'dislike' ? 'text-rose-400 bg-rose-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Dislike"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-full glass-panel border border-white/10 text-slate-400 hover:text-white"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Unboxed Metadata (Zero-Pill standard) */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-1 text-amber-300 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span className="tabular-nums font-mono">{item.score.toFixed(1)}</span>
                </span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span>{item.releaseYear}</span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="border border-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono">
                  {item.rating}
                </span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span>{item.duration}</span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="text-cyan-300">{item.genres.join(', ')}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 my-6 p-1.5 rounded-2xl glass-panel border border-white/10 max-w-md">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Overview & Cast
              </button>
              {item.type === 'series' && item.seasons && item.seasons.length > 0 && (
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                    activeTab === 'episodes'
                      ? 'bg-white text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Episodes ({item.seasons.reduce((acc, s) => acc + s.episodes.length, 0)})
                </button>
              )}
              <button
                onClick={() => setActiveTab('similar')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'similar'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                More Like This
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Synopsis */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-display font-bold text-lg text-white">Storyline</h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Available in Ultra High Definition 4K with dynamic HDR10+, Dolby Vision master color grading, and multidimensional spatial audio streaming.
                  </p>
                </div>

                {/* Cast & Crew Info */}
                <div className="space-y-4 p-5 rounded-2xl glass-panel border border-white/10">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Director
                    </span>
                    <span className="text-sm font-medium text-white">{item.director}</span>
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Starring Cast
                    </span>
                    <div className="flex flex-col gap-1 text-sm text-slate-200">
                      {item.cast.map((actor, idx) => (
                        <span key={idx}>{actor}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Audio & Subtitles
                    </span>
                    <span className="text-xs text-slate-300">
                      English (Atmos), French, Spanish, Japanese, German · 24 Subtitle Languages
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Episodes (Series) */}
            {activeTab === 'episodes' && item.seasons && (
              <div className="space-y-6">
                {/* Season Switcher */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Select Season:
                  </span>
                  <div className="flex items-center gap-2">
                    {item.seasons.map((s) => (
                      <button
                        key={s.seasonNumber}
                        onClick={() => setSelectedSeason(s.seasonNumber)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedSeason === s.seasonNumber
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                            : 'glass-panel text-slate-300 hover:text-white border-white/10'
                        }`}
                      >
                        Season {s.seasonNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Episode Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSeasonData?.episodes.map((ep) => (
                    <div
                      key={ep.episodeNumber}
                      onClick={() => handlePlay(ep.episodeNumber)}
                      className="group flex gap-4 p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.06] transition-all cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-36 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-white/10">
                        <img
                          src={ep.thumbnailUrl}
                          alt={ep.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-lg">
                            <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-display font-semibold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                            {ep.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono shrink-0">
                            {ep.duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300/80 line-clamp-2 mt-1">
                          {ep.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Similar Content */}
            {activeTab === 'similar' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {similarItems.map((similar) => (
                  <MediaCard
                    key={similar.id}
                    item={similar}
                    onOpenDetails={() => {
                      navigate('details', { id: similar.id });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
