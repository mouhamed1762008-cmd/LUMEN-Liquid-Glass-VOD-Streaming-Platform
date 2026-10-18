import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useStreaming } from '../context/StreamingContext';
import { MEDIA_ITEMS } from '../data/mockData';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Settings,
  FastForward,
  Subtitles,
  Check,
  AlertCircle,
} from 'lucide-react';

interface VideoPlayerViewProps {
  mediaId: string;
  seasonNumber?: number;
  episodeNumber?: number;
}

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({
  mediaId,
  seasonNumber = 1,
  episodeNumber = 1,
}) => {
  const { navigate, continueWatching, saveProgress, user, showToast } = useStreaming();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const media = MEDIA_ITEMS.find((m) => m.id === mediaId) || MEDIA_ITEMS[0];
  
  // If series, determine episode
  const isSeries = media.type === 'series';
  const currentSeason = media.seasons?.find((s) => s.seasonNumber === seasonNumber) || media.seasons?.[0];
  const currentEpisode = currentSeason?.episodes.find((e) => e.episodeNumber === episodeNumber) || currentSeason?.episodes[0];
  
  const videoSource = isSeries && currentEpisode ? currentEpisode.videoUrl : media.videoUrl;
  const contentTitle = isSeries && currentEpisode
    ? `${media.title} — S${currentSeason?.seasonNumber || 1}:E${currentEpisode.episodeNumber} "${currentEpisode.title}"`
    : media.title;

  // Player States
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('English [CC]');
  const [selectedAudio, setSelectedAudio] = useState<string>('English (Original 5.1)');
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showSkipIntro, setShowSkipIntro] = useState<boolean>(false);

  // Inactivity timer for auto-hiding controls
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimeout = useCallback(() => {
    setControlsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
        setShowSettings(false);
        setShowSubtitles(false);
      }, 3500);
    }
  }, [isPlaying]);

  // Resume playback position
  useEffect(() => {
    const saved = continueWatching[mediaId];
    if (saved && saved.currentTime > 5 && videoRef.current) {
      videoRef.current.currentTime = saved.currentTime;
      setCurrentTime(saved.currentTime);
      showToast(`Resumed at ${formatTime(saved.currentTime)}`, 'info');
    }
  }, [mediaId]);

  // Save progress periodically and on unmount
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        saveProgress(
          mediaId,
          videoRef.current.currentTime,
          videoRef.current.duration,
          seasonNumber,
          episodeNumber
        );
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      if (videoRef.current) {
        saveProgress(
          mediaId,
          videoRef.current.currentTime,
          videoRef.current.duration,
          seasonNumber,
          episodeNumber
        );
      }
    };
  }, [mediaId, seasonNumber, episodeNumber, saveProgress]);

  // Video Event Handlers
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    // Show skip intro between 10s and 80s
    if (cur > 10 && cur < 80) {
      setShowSkipIntro(true);
    } else {
      setShowSkipIntro(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    videoRef.current.volume = volume;
    videoRef.current.playbackRate = playbackSpeed;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
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
    resetControlsTimeout();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    resetControlsTimeout();
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    resetControlsTimeout();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
    }
    resetControlsTimeout();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
    resetControlsTimeout();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
    showToast(`Speed: ${speed}x`, 'cyan');
    resetControlsTimeout();
  };

  const handleSkipIntro = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 85;
    setShowSkipIntro(false);
    showToast('Intro skipped', 'info');
    resetControlsTimeout();
  };

  const handleNextEpisode = () => {
    if (!isSeries || !currentSeason) return;
    const nextEpNum = (episodeNumber || 1) + 1;
    const nextEp = currentSeason.episodes.find((e) => e.episodeNumber === nextEpNum);
    if (nextEp) {
      navigate('watch', { id: media.id, season: seasonNumber, episode: nextEpNum });
      showToast(`Playing Episode ${nextEpNum}: ${nextEp.title}`, 'cyan');
    } else {
      showToast('You have reached the end of this season', 'info');
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipSeconds(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipSeconds(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.min(1, v + 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            return next;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.max(0, v - 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            return next;
          });
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (showSettings) setShowSettings(false);
          if (showSubtitles) setShowSubtitles(false);
          break;
        default:
          break;
      }
      resetControlsTimeout();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, resetControlsTimeout, showSettings, showSubtitles]);

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSource}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={() => setHasError(true)}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-30">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h2 className="font-display font-bold text-xl text-white">Stream Temporarily Unavailable</h2>
          <p className="text-sm text-slate-400 max-w-md mt-1 mb-4">
            Could not load video source for this title. Please try another program or return to catalog.
          </p>
          <button
            onClick={() => navigate('home')}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all"
          >
            Return to Home
          </button>
        </div>
      )}

      {/* Skip Intro Button */}
      {showSkipIntro && (
        <div className="absolute bottom-24 right-8 z-30 animate-in fade-in duration-300">
          <button
            onClick={handleSkipIntro}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel-elevated border border-cyan-400/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all hover:scale-105"
          >
            <FastForward className="w-4 h-4" />
            <span>Skip Intro</span>
          </button>
        </div>
      )}

      {/* Ambient Glass Glow Behind HUD */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          controlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Top Bar HUD */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 px-6 py-5 flex items-center justify-between transition-all duration-300 ${
          controlsVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full glass-panel border border-white/20 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            title="Exit Player"
            aria-label="Back to Browse"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-semibold text-base sm:text-lg text-white drop-shadow">
              {contentTitle}
            </h1>
            <span className="text-xs text-cyan-300 font-medium">4K Ultra HD · Dolby Vision · Spatial Audio</span>
          </div>
        </div>

        {/* Top Right Options */}
        <div className="flex items-center gap-2">
          {/* Subtitles Button */}
          <button
            onClick={() => {
              setShowSubtitles(!showSubtitles);
              setShowSettings(false);
            }}
            className={`w-10 h-10 rounded-full glass-panel border flex items-center justify-center transition-all ${
              showSubtitles ? 'border-cyan-400 text-cyan-300' : 'border-white/15 text-slate-300 hover:text-white'
            }`}
            title="Audio & Subtitles"
            aria-label="Audio & Subtitles"
          >
            <Subtitles className="w-4 h-4" />
          </button>

          {/* Speed & Settings Button */}
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowSubtitles(false);
            }}
            className={`w-10 h-10 rounded-full glass-panel border flex items-center justify-center transition-all ${
              showSettings ? 'border-cyan-400 text-cyan-300' : 'border-white/15 text-slate-300 hover:text-white'
            }`}
            title="Playback Settings"
            aria-label="Playback Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Subtitle / Audio Popover */}
      {showSubtitles && (
        <div className="absolute top-20 right-6 z-30 w-72 rounded-2xl glass-panel-elevated p-4 border border-white/20 text-xs shadow-2xl animate-in fade-in">
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-2">Subtitles</h4>
          <div className="space-y-1 mb-4">
            {['Off', 'English [CC]', 'Spanish', 'French', 'German'].map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSubtitle(sub);
                  showToast(`Subtitles: ${sub}`, 'info');
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors ${
                  selectedSubtitle === sub ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>{sub}</span>
                {selectedSubtitle === sub && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-2">Audio Track</h4>
          <div className="space-y-1">
            {['English (Original 5.1)', 'French (Stereo)', 'Spanish (Stereo)'].map((aud) => (
              <button
                key={aud}
                onClick={() => {
                  setSelectedAudio(aud);
                  showToast(`Audio: ${aud}`, 'info');
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors ${
                  selectedAudio === aud ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span>{aud}</span>
                {selectedAudio === aud && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Playback Settings Popover */}
      {showSettings && (
        <div className="absolute top-20 right-6 z-30 w-64 rounded-2xl glass-panel-elevated p-4 border border-white/20 text-xs shadow-2xl animate-in fade-in">
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-2">Playback Speed</h4>
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedSelect(speed)}
                className={`py-1.5 rounded-lg font-mono font-medium text-center transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/40'
                    : 'glass-panel text-slate-300 hover:bg-white/10'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-2">Streaming Quality</h4>
          <div className="space-y-1">
            {['Auto (4K HDR)', '1080p HD', '720p SD'].map((qual) => (
              <div
                key={qual}
                className={`px-3 py-1.5 rounded-lg flex items-center justify-between ${
                  user.preferredQuality === qual ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-300'
                }`}
              >
                <span>{qual}</span>
                {user.preferredQuality === qual && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Controls HUD */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 px-6 pb-6 pt-3 transition-all duration-300 ${
          controlsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-6xl mx-auto rounded-3xl glass-panel-elevated border border-white/15 px-6 py-4 shadow-2xl flex flex-col gap-3">
          {/* Seek Scrubber Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tabular-nums text-slate-300 w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 flex items-center group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-300"
              />
              {/* Glow progress bar fill */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full pointer-events-none shadow-[0_0_8px_#00f0ff]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-400 w-12">
              {formatTime(duration)}
            </span>
          </div>

          {/* Control Buttons Bar */}
          <div className="flex items-center justify-between">
            {/* Left Controls: Play, Skips, Volume */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white hover:bg-cyan-300 text-slate-950 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
              </button>

              <button
                onClick={() => skipSeconds(-10)}
                className="text-slate-300 hover:text-white transition-colors"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => skipSeconds(10)}
                className="text-slate-300 hover:text-white transition-colors"
                title="Forward 10 seconds"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 group">
                <button
                  onClick={toggleMute}
                  className="text-slate-300 hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Right Controls: Next Episode, Quality tag, Fullscreen */}
            <div className="flex items-center gap-3">
              {isSeries && (
                <button
                  onClick={handleNextEpisode}
                  className="px-3.5 py-1.5 rounded-full glass-panel border border-white/15 text-xs text-slate-200 hover:text-cyan-300 hover:border-cyan-400/40 font-medium transition-all flex items-center gap-1.5"
                >
                  <span>Next Episode</span>
                  <FastForward className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="hidden sm:inline text-[11px] font-mono tracking-wider text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded">
                4K HDR
              </span>

              <button
                onClick={toggleFullscreen}
                className="text-slate-300 hover:text-white transition-colors p-1"
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
