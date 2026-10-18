import React, { useState, useRef } from 'react';
import { LIVE_CHANNELS } from '../data/mockData';
import { LiveChannel, ScheduledProgram } from '../types';
import { useStreaming } from '../context/StreamingContext';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Heart,
  Clock,
  Tv,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

export const LiveTvView: React.FC = () => {
  const { favoriteChannels, toggleFavoriteChannel, isFavoriteChannel, showToast } = useStreaming();

  const [activeChannelId, setActiveChannelId] = useState<string>(LIVE_CHANNELS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [selectedProgramModal, setSelectedProgramModal] = useState<ScheduledProgram | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const activeChannel = LIVE_CHANNELS.find((ch) => ch.id === activeChannelId) || LIVE_CHANNELS[0];

  const categories = ['All', 'Favorites', 'Cinema', 'Sci-Fi', 'News', 'Sports', 'Documentary'];

  const filteredChannels = LIVE_CHANNELS.filter((ch) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Favorites') return isFavoriteChannel(ch.id);
    return ch.category === selectedCategory;
  });

  const handleChannelSwitch = (channel: LiveChannel) => {
    setActiveChannelId(channel.id);
    setIsPlaying(true);
    showToast(`Switched to ${channel.name}`, 'cyan');
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-widest text-rose-400 font-mono">
              Live EPG Broadcast Network
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Television & Channels
          </h1>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'glass-panel text-slate-400 hover:text-white border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Broadcast Screen & Active Program Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Video Player Area (2 cols on lg) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div
            ref={playerContainerRef}
            className="relative aspect-video w-full rounded-3xl overflow-hidden glass-panel-elevated border border-white/15 shadow-2xl bg-black"
          >
            {/* Live Video Stream */}
            <video
              ref={videoRef}
              src={activeChannel.streamUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
              onClick={togglePlay}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Top Left Live Banner */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>LIVE</span>
              </div>
              <div className="px-3 py-1 rounded-full glass-panel border border-white/20 text-xs font-semibold text-white">
                {activeChannel.callsign}
              </div>
            </div>

            {/* Top Right Channel Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={() => toggleFavoriteChannel(activeChannel.id)}
                className={`w-9 h-9 rounded-full glass-panel border flex items-center justify-center transition-all ${
                  isFavoriteChannel(activeChannel.id)
                    ? 'border-rose-400 text-rose-400 bg-rose-500/20'
                    : 'border-white/20 text-white hover:text-rose-400'
                }`}
                title="Favorite Channel"
              >
                <Heart
                  className={`w-4 h-4 ${isFavoriteChannel(activeChannel.id) ? 'fill-rose-400' : ''}`}
                />
              </button>
            </div>

            {/* Bottom Player Overlay HUD */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
              {/* Channel & Current Program Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-display font-black text-sm text-slate-950 shadow-md">
                  {activeChannel.logoText}
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base leading-tight drop-shadow">
                    {activeChannel.currentProgram.title}
                  </h3>
                  <p className="text-xs text-cyan-300 font-medium">
                    {activeChannel.name} · {activeChannel.currentProgram.time}
                  </p>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full glass-panel border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="w-9 h-9 rounded-full glass-panel border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="w-9 h-9 rounded-full glass-panel border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                  aria-label="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Current Program Detailed Synopsis */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-mono font-semibold">
                Now Airing on {activeChannel.name}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Category: {activeChannel.category}
              </span>
            </div>
            <h4 className="font-display font-bold text-lg text-white">
              {activeChannel.currentProgram.title}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeChannel.currentProgram.description}
            </p>

            {/* Broadcast timeline progress */}
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Progress: {activeChannel.currentProgram.progressPercent}%</span>
                <span>{activeChannel.currentProgram.time}</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_8px_#00f0ff]"
                  style={{ width: `${activeChannel.currentProgram.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Channel Selector Sidebar (1 col on lg) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-bold text-base text-white">
              Channel Lineup ({filteredChannels.length})
            </h3>
            <span className="text-xs text-slate-400">Instant Switch</span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
            {filteredChannels.map((channel) => {
              const isActive = channel.id === activeChannelId;
              const isFav = isFavoriteChannel(channel.id);
              return (
                <div
                  key={channel.id}
                  onClick={() => handleChannelSwitch(channel)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'glass-panel border-white/10 hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-xs shrink-0 ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 shadow-md'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {channel.logoText}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-sm text-white truncate">
                          {channel.name}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {channel.currentProgram.title}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteChannel(channel.id);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isFav ? 'text-rose-400' : 'text-slate-500 hover:text-white'
                    }`}
                    aria-label="Toggle favorite"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Electronic Program Guide (EPG) Schedule Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display font-bold text-xl text-white">
              Electronic Program Guide (EPG)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Selected: <span className="text-cyan-300 font-semibold">{activeChannel.name}</span>
          </span>
        </div>

        <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden divide-y divide-white/10">
          {activeChannel.schedule.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedProgramModal(item)}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer hover:bg-white/5 ${
                item.isCurrent ? 'bg-cyan-500/10' : ''
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-20 shrink-0 font-mono text-sm font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.time}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-semibold text-sm sm:text-base text-white">
                      {item.title}
                    </h4>
                    {item.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                        AIRING NOW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <span className="text-xs font-mono text-slate-400">{item.duration}</span>
                <span className="text-xs text-slate-500 border border-white/10 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Program Details Modal */}
      {selectedProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl glass-panel-elevated p-6 border border-white/20 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                Program Information
              </span>
              <button
                onClick={() => setSelectedProgramModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              {selectedProgramModal.title}
            </h3>
            <p className="text-xs font-mono text-slate-400 mb-4">
              Time: {selectedProgramModal.time} ({selectedProgramModal.duration}) · Genre: {selectedProgramModal.category}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {selectedProgramModal.description}
            </p>
            <button
              onClick={() => setSelectedProgramModal(null)}
              className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-xs hover:bg-cyan-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
