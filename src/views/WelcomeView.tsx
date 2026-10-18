import React, { useState } from 'react';
import { useStreaming } from '../context/StreamingContext';
import { AVATAR_OPTIONS } from '../data/mockData';
import heroCelestialOdyssey from '../assets/images/hero_celestial_odyssey_1792354181383.jpg';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

export const WelcomeView: React.FC = () => {
  const { user, completeOnboarding } = useStreaming();
  const [name, setName] = useState(user.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || AVATAR_OPTIONS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding(name, selectedAvatar);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Cinematic Ambient Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroCelestialOdyssey}
          alt="LUMEN cinematic backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-110 blur-xs brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/80 to-[#05070c]/40" />

        {/* Dynamic Glow Refractions */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-cyan-500/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-[130px] pointer-events-none" />
      </div>

      {/* Main Glass Welcome Card */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl glass-panel-elevated p-8 sm:p-12 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-center animate-in fade-in zoom-in-95 duration-500">
        {/* Logo Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-6">
          <Sparkles className="w-8 h-8 text-slate-950 fill-slate-950" />
        </div>

        <span className="text-xs font-semibold tracking-widest uppercase text-cyan-300 font-mono">
          Liquid Glass VOD Experience
        </span>

        {/* Headline */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-2 mb-3">
          Your next favorite story starts here.
        </h1>

        <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed max-w-md mx-auto mb-8">
          Welcome to <span className="font-semibold text-white">LUMEN</span>. Stream award-winning originals, 4K sci-fi epics, and live television with next-generation glass aesthetics.
        </p>

        {/* Interactive Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Name Input */}
          <div>
            <label htmlFor="user-name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              What should we call you?
            </label>
            <div className="relative">
              <input
                id="user-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name or moniker..."
                className="w-full px-5 py-3.5 rounded-2xl glass-panel border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm transition-all shadow-inner"
                autoFocus
              />
            </div>
          </div>

          {/* Choose Avatar */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
              Choose your profile avatar
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`relative p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'glass-panel border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-105'
                        : 'glass-panel border-white/10 hover:border-white/25 hover:bg-white/5 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${avatar.bg} flex items-center justify-center text-base shadow-sm`}>
                      <span>{avatar.icon}</span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                      {avatar.label}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white hover:bg-cyan-300 text-slate-950 font-bold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_rgba(0,240,255,0.3)] cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

        {/* Security / Privacy micro note */}
        <p className="text-[11px] text-slate-500 mt-6">
          Your profile, viewing progress, and watchlists are safely preserved locally on your device.
        </p>
      </div>
    </div>
  );
};
