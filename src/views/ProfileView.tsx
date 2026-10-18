import React, { useState } from 'react';
import { useStreaming } from '../context/StreamingContext';
import { MEDIA_ITEMS, AVATAR_OPTIONS } from '../data/mockData';
import { MediaItem } from '../types';
import { MediaCard } from '../components/MediaCard';
import {
  User,
  Edit2,
  Check,
  Trash2,
  Film,
  Tv,
  Settings2,
  Sliders,
  LogOut,
  Sparkles,
  Bookmark,
  Heart,
  History,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenDetails: (item: MediaItem) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenDetails }) => {
  const {
    user,
    setUserName,
    setUserAvatar,
    updateUserPreferences,
    watchlist,
    favorites,
    continueWatching,
    clearHistory,
    removeFromContinueWatching,
    navigate,
    showToast,
  } = useStreaming();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'favorites' | 'history' | 'settings'>('watchlist');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const activeAvatar = AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  const watchlistItems = MEDIA_ITEMS.filter((m) => watchlist.includes(m.id));
  const favoriteItems = MEDIA_ITEMS.filter((m) => favorites.includes(m.id));
  const historyIds = Object.keys(continueWatching);
  const historyItems = MEDIA_ITEMS.filter((m) => historyIds.includes(m.id));

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      showToast('Profile name updated', 'success');
    }
    setIsEditingName(false);
  };

  const handleResetProfile = () => {
    if (window.confirm('Reset local demo settings and onboarding?')) {
      localStorage.clear();
      window.location.href = '/welcome';
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="relative rounded-3xl glass-panel-elevated border border-white/15 p-6 sm:p-8 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10 text-center sm:text-left">
          {/* Avatar and Name */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <div
                className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${activeAvatar.bg} flex items-center justify-center text-4xl shadow-2xl border-2 border-white/20`}
              >
                <span>{activeAvatar.icon}</span>
              </div>
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute inset-0 rounded-3xl bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs font-semibold transition-opacity cursor-pointer"
              >
                <Edit2 className="w-4 h-4 mb-1" />
                <span>Change</span>
              </button>
            </div>

            <div>
              {/* Name Editor */}
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                {!isEditingName ? (
                  <>
                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                      {user.name || 'Explorer'}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-slate-400 hover:text-cyan-300 p-1 transition-colors"
                      title="Edit Name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="px-3 py-1.5 rounded-xl glass-panel border border-cyan-400 text-white text-base focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-2 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Status and Membership Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-2 font-medium justify-center sm:justify-start">
                <span className="text-cyan-300 font-semibold">{activeAvatar.label}</span>
                <span>·</span>
                <span className="text-slate-400">LUMEN Premier Member</span>
                <span>·</span>
                <span>4K Ultra HD</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-center">
            <div className="px-4 py-3 rounded-2xl glass-panel border border-white/10 min-w-[90px]">
              <span className="font-display font-bold text-xl text-white block">
                {watchlist.length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Watchlist</span>
            </div>
            <div className="px-4 py-3 rounded-2xl glass-panel border border-white/10 min-w-[90px]">
              <span className="font-display font-bold text-xl text-white block">
                {favorites.length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Favorites</span>
            </div>
            <div className="px-4 py-3 rounded-2xl glass-panel border border-white/10 min-w-[90px]">
              <span className="font-display font-bold text-xl text-white block">
                {historyIds.length}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Watched</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 max-w-lg overflow-x-auto no-scrollbar">
        {[
          { id: 'watchlist', label: 'My Watchlist', icon: Bookmark, count: watchlist.length },
          { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
          { id: 'history', label: 'Viewing History', icon: History, count: historyIds.length },
          { id: 'settings', label: 'Preferences', icon: Settings2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content: Watchlist */}
      {activeTab === 'watchlist' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-white">Saved in Watchlist</h2>
            <span className="text-xs text-slate-400 font-mono">{watchlistItems.length} Titles</span>
          </div>

          {watchlistItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {watchlistItems.map((item) => (
                <MediaCard key={item.id} item={item} onOpenDetails={onOpenDetails} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center glass-panel rounded-3xl border border-white/10">
              <Bookmark className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 font-semibold text-sm">Your watchlist is empty</p>
              <p className="text-xs text-slate-500 mt-1">
                Browse movies and series and click the "+" button to save them here.
              </p>
              <button
                onClick={() => navigate('movies')}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 border border-cyan-400/30"
              >
                Browse Catalog
              </button>
            </div>
          )}
        </section>
      )}

      {/* Tab Content: Favorites */}
      {activeTab === 'favorites' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-white">Your Favorite Titles</h2>
            <span className="text-xs text-slate-400 font-mono">{favoriteItems.length} Titles</span>
          </div>

          {favoriteItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {favoriteItems.map((item) => (
                <MediaCard key={item.id} item={item} onOpenDetails={onOpenDetails} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center glass-panel rounded-3xl border border-white/10">
              <Heart className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 font-semibold text-sm">No favorites added yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Add titles to your favorites directly from the details page.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Tab Content: History */}
      {activeTab === 'history' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-white">Viewing History</h2>
            {historyItems.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}
          </div>

          {historyItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {historyItems.map((item) => {
                const progressData = continueWatching[item.id];
                const percent = progressData && progressData.duration > 0
                  ? (progressData.currentTime / progressData.duration) * 100
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-14 h-20 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display font-semibold text-sm text-white truncate">
                          {item.title}
                        </h4>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          {item.releaseYear} · {item.duration}
                        </span>
                        <div className="mt-2 space-y-1">
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-cyan-300 font-mono">
                            {Math.round(percent)}% watched
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                      <button
                        onClick={() => navigate('watch', { id: item.id })}
                        className="text-cyan-300 hover:text-white font-medium"
                      >
                        Resume Watching →
                      </button>
                      <button
                        onClick={() => removeFromContinueWatching(item.id)}
                        className="text-slate-500 hover:text-rose-400"
                        title="Remove from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center glass-panel rounded-3xl border border-white/10">
              <History className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 font-semibold text-sm">No playback history</p>
              <p className="text-xs text-slate-500 mt-1">
                Titles you watch will automatically save progress here.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Tab Content: Preferences & Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5">
            <h3 className="font-display font-bold text-lg text-white">Playback & Audio Settings</h3>

            {/* Autoplay Next */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white block">Autoplay Next Episode</span>
                <span className="text-xs text-slate-400">
                  Automatically start the next episode after credits
                </span>
              </div>
              <input
                type="checkbox"
                checked={user.autoplayNext}
                onChange={(e) => updateUserPreferences({ autoplayNext: e.target.checked })}
                className="w-5 h-5 rounded accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="h-px bg-white/10" />

            {/* Streaming Quality */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-white block">Default Streaming Quality</span>
              <div className="grid grid-cols-3 gap-2">
                {['Auto (4K HDR)', '1080p HD', '720p SD'].map((qual) => (
                  <button
                    key={qual}
                    onClick={() => updateUserPreferences({ preferredQuality: qual as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      user.preferredQuality === qual
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'glass-panel text-slate-400 hover:text-white border-white/10'
                    }`}
                  >
                    {qual}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Preferred Language */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-white block">Default Audio Language</span>
              <select
                value={user.preferredLanguage}
                onChange={(e) => updateUserPreferences({ preferredLanguage: e.target.value })}
                className="w-full bg-slate-900 border border-white/15 text-slate-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-400"
              >
                <option value="English (Original)">English (Original 5.1 Spatial)</option>
                <option value="French">Français</option>
                <option value="Spanish">Español</option>
                <option value="German">Deutsch</option>
                <option value="Japanese">日本語</option>
              </select>
            </div>
          </div>

          {/* Reset App / Account Box */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-rose-400 block">Sign Out & Reset Demo</span>
              <span className="text-xs text-slate-400">
                Clears all local history, saved name, and returns to the welcome screen.
              </span>
            </div>
            <button
              onClick={handleResetProfile}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Avatar Switcher Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl glass-panel-elevated p-6 border border-white/20 shadow-2xl animate-in fade-in">
            <h3 className="font-display font-bold text-lg text-white mb-4">Choose Your Avatar</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = user.avatar === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => {
                      setUserAvatar(avatar.id);
                      setShowAvatarModal(false);
                      showToast(`Avatar updated to ${avatar.label}`, 'success');
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'glass-panel border-white/10 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-tr ${avatar.bg} flex items-center justify-center text-xl shadow-md`}
                    >
                      <span>{avatar.icon}</span>
                    </div>
                    <span className="text-[11px] text-slate-300 font-medium">{avatar.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowAvatarModal(false)}
              className="w-full py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
