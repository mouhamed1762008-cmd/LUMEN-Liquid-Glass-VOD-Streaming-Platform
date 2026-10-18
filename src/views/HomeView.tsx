import React from 'react';
import { useStreaming } from '../context/StreamingContext';
import { MEDIA_ITEMS, LIVE_CHANNELS } from '../data/mockData';
import { MediaItem } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { MediaCarousel } from '../components/MediaCarousel';
import { Play, Radio, ChevronRight, Clock, Sparkles } from 'lucide-react';

interface HomeViewProps {
  onOpenDetails: (item: MediaItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenDetails }) => {
  const { user, continueWatching, navigate } = useStreaming();

  // Featured Hero Item (Chronos Protocol or Celestial Odyssey)
  const featuredItem = MEDIA_ITEMS.find((m) => m.id === 'chronos-protocol') || MEDIA_ITEMS[0];

  // Continue Watching Items
  const continueWatchingIds = Object.keys(continueWatching);
  const continueWatchingItems = MEDIA_ITEMS.filter((m) => continueWatchingIds.includes(m.id));
  
  // Progress map percentage
  const progressMap: Record<string, number> = {};
  continueWatchingIds.forEach((id) => {
    const data = continueWatching[id];
    if (data && data.duration > 0) {
      progressMap[id] = (data.currentTime / data.duration) * 100;
    }
  });

  // Trending Now
  const trendingItems = MEDIA_ITEMS.filter((m) => m.isTrending);

  // Popular Movies
  const popularMovies = MEDIA_ITEMS.filter((m) => m.type === 'movie');

  // Trending Series
  const trendingSeries = MEDIA_ITEMS.filter((m) => m.type === 'series');

  // Recommended for you
  const recommendedItems = [...MEDIA_ITEMS].reverse();

  // Live TV Preview channel
  const primaryChannel = LIVE_CHANNELS[0];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Featured Billboard Hero */}
      <HeroBanner item={featuredItem} onOpenDetails={onOpenDetails} />

      {/* Main Content Sections Container */}
      <div className="relative z-10 -mt-8 sm:-mt-12 space-y-6">
        {/* Personalized Greeting Header */}
        <div className="px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-sm sm:text-base font-medium text-slate-300">
              {getTimeGreeting()},{' '}
              <span className="font-semibold text-white">{user.name || 'Explorer'}</span>. Your queue is primed.
            </h2>
          </div>
        </div>

        {/* Continue Watching (with actual progress bars) */}
        {continueWatchingItems.length > 0 && (
          <MediaCarousel
            title="Continue Watching"
            subtitle="Pick up right where you left off"
            items={continueWatchingItems}
            aspectRatio="backdrop"
            progressMap={progressMap}
            onOpenDetails={onOpenDetails}
          />
        )}

        {/* Trending Now */}
        <MediaCarousel
          title="Trending Now"
          subtitle="Top rated productions this week on LUMEN"
          items={trendingItems}
          aspectRatio="poster"
          onOpenDetails={onOpenDetails}
        />

        {/* Live TV Preview Glass Banner */}
        <section className="px-4 sm:px-8 max-w-7xl mx-auto my-8">
          <div className="rounded-3xl glass-panel-elevated border border-white/15 p-6 sm:p-8 overflow-hidden relative group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>LIVE BROADCAST</span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                  {primaryChannel.name} · {primaryChannel.currentProgram.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {primaryChannel.currentProgram.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-4">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{primaryChannel.currentProgram.time}</span>
                  </span>
                  <span>·</span>
                  <span>{primaryChannel.category}</span>
                  <span>·</span>
                  <span>Dolby 5.1</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => navigate('live-tv')}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-all hover:scale-105 shadow-lg cursor-pointer"
                >
                  <Radio className="w-4 h-4 ml-0.5" />
                  <span>Tune In Live</span>
                </button>

                <button
                  onClick={() => navigate('live-tv')}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-full glass-panel border border-white/15 text-slate-200 hover:text-white text-xs font-medium transition-all"
                >
                  <span>Full EPG Guide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Feature Films */}
        <MediaCarousel
          title="Popular Movies"
          subtitle="Blockbuster releases and indie speculative masterpieces"
          items={popularMovies}
          aspectRatio="poster"
          onOpenDetails={onOpenDetails}
        />

        {/* Trending Series */}
        <MediaCarousel
          title="Trending Series"
          subtitle="Multi-season narrative epics and prestige dramas"
          items={trendingSeries}
          aspectRatio="backdrop"
          onOpenDetails={onOpenDetails}
        />

        {/* Recommended For You */}
        <MediaCarousel
          title="Recommended For You"
          subtitle="Curated according to your cinematic interests"
          items={recommendedItems}
          aspectRatio="poster"
          onOpenDetails={onOpenDetails}
        />
      </div>
    </div>
  );
};
