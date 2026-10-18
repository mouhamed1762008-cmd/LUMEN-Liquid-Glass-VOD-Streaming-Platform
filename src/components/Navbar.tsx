import React, { useState } from 'react';
import { useStreaming } from '../context/StreamingContext';
import { AVATAR_OPTIONS } from '../data/mockData';
import { Search, Film, Tv, Radio, Home, User, Sparkles, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRoute, navigate, user } = useStreaming();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAvatar = AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'series', label: 'Series', icon: Tv },
    { id: 'live-tv', label: 'Live TV', icon: Radio },
    { id: 'search', label: 'Search', icon: Search },
  ];

  const handleNavClick = (id: string) => {
    navigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop & Tablet Floating Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-2.5 rounded-full glass-panel border border-white/10 shadow-[0_12px_32px_0_rgba(0,0,0,0.5)]">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-2.5 text-left shrink-0 cursor-pointer focus:outline-none"
            aria-label="LUMEN Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-shadow">
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-wider text-white group-hover:text-cyan-300 transition-colors">
              LUMEN
            </span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 text-xs uppercase tracking-wider font-semibold ${
                    isActive ? 'text-cyan-300' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_#00f0ff]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Profile Action & Mobile Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Profile Pill */}
            <button
              onClick={() => handleNavClick('profile')}
              className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full transition-all cursor-pointer ${
                currentRoute === 'profile'
                  ? 'bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200'
              }`}
              title="Open Profile & Settings"
            >
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-tr ${activeAvatar.bg} flex items-center justify-center text-xs shadow-inner`}
              >
                <span>{activeAvatar.icon}</span>
              </div>
              <span className="text-xs font-medium max-w-[100px] truncate hidden sm:inline">
                {user.name || 'Profile'}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 border border-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-auto max-w-sm rounded-2xl glass-panel-elevated p-4 border border-white/15 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentRoute === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => handleNavClick('profile')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentRoute === 'profile'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>My Profile & Preferences</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Fixed Bottom Navigation Bar for rapid one-thumb access */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 px-3 py-2 rounded-2xl glass-panel-elevated border border-white/15 shadow-2xl flex items-center justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentRoute === link.id;
          return (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-cyan-300 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] tracking-tight font-medium">{link.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
