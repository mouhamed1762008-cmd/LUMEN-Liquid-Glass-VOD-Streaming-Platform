import React, { useState } from 'react';
import { StreamingProvider, useStreaming } from './context/StreamingContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { DetailsModal } from './components/DetailsModal';
import { WelcomeView } from './views/WelcomeView';
import { HomeView } from './views/HomeView';
import { MoviesView } from './views/MoviesView';
import { SeriesView } from './views/SeriesView';
import { LiveTvView } from './views/LiveTvView';
import { SearchView } from './views/SearchView';
import { ProfileView } from './views/ProfileView';
import { VideoPlayerView } from './views/VideoPlayerView';
import { MediaItem } from './types';
import { MEDIA_ITEMS } from './data/mockData';
import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, routeParams, user, navigate } = useStreaming();
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<MediaItem | null>(null);

  const handleOpenDetails = (item: MediaItem) => {
    setSelectedDetailsItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedDetailsItem(null);
    if (currentRoute === 'details') {
      navigate('home');
    }
  };

  // If user has not onboarded and tries to access general pages, show WelcomeView
  if (!user.hasOnboarded && currentRoute !== 'watch') {
    return (
      <div className="min-h-screen bg-[#05070c] text-white">
        <WelcomeView />
        <ToastContainer />
      </div>
    );
  }

  // If in Video Player, render dedicated distraction-free view without top navbar
  if (currentRoute === 'watch' && routeParams.id) {
    return (
      <div className="min-h-screen bg-black text-white">
        <VideoPlayerView
          mediaId={routeParams.id}
          seasonNumber={routeParams.season || 1}
          episodeNumber={routeParams.episode || 1}
        />
        <ToastContainer />
      </div>
    );
  }

  // Active details modal from URL /details/:id
  const activeDetailsMedia =
    currentRoute === 'details' && routeParams.id
      ? MEDIA_ITEMS.find((m) => m.id === routeParams.id) || null
      : selectedDetailsItem;

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Global Floating Glass Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentRoute === 'welcome' && <WelcomeView />}
        {(currentRoute === 'home' || currentRoute === 'details') && (
          <HomeView onOpenDetails={handleOpenDetails} />
        )}
        {currentRoute === 'movies' && <MoviesView onOpenDetails={handleOpenDetails} />}
        {currentRoute === 'series' && <SeriesView onOpenDetails={handleOpenDetails} />}
        {currentRoute === 'live-tv' && <LiveTvView />}
        {currentRoute === 'search' && <SearchView onOpenDetails={handleOpenDetails} />}
        {currentRoute === 'profile' && <ProfileView onOpenDetails={handleOpenDetails} />}
      </main>

      {/* Details Dialog Modal */}
      {activeDetailsMedia && (
        <DetailsModal
          mediaId={activeDetailsMedia.id}
          onClose={handleCloseDetails}
        />
      )}

      {/* Global Toasts */}
      <ToastContainer />

      {/* Liquid Glass Footer */}
      <footer className="mt-auto border-t border-white/10 py-10 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
            </div>
            <span className="font-display font-bold text-white tracking-wider">LUMEN</span>
            <span className="text-slate-600">·</span>
            <span>Liquid Glass VOD Streaming</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button onClick={() => navigate('home')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => navigate('movies')} className="hover:text-white transition-colors">
              Movies
            </button>
            <button onClick={() => navigate('series')} className="hover:text-white transition-colors">
              Series
            </button>
            <button onClick={() => navigate('live-tv')} className="hover:text-white transition-colors">
              Live TV
            </button>
            <button onClick={() => navigate('profile')} className="hover:text-white transition-colors">
              Settings
            </button>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            © 2026 LUMEN Streaming Network. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <StreamingProvider>
      <AppContent />
    </StreamingProvider>
  );
}
