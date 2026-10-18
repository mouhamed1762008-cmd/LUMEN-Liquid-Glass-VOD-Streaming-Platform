# LUMEN — Liquid Glass VOD Streaming Platform

LUMEN is a futuristic, cinematic streaming platform inspired by Apple's Liquid Glass design language, Apple TV+, and prestige cinema. It delivers an ultra-smooth, translucent glassmorphism experience with deep midnight hues, electric cyan specular highlights, real playable video streams, interactive live TV EPG scheduling, comprehensive search, and persistent personalized watchlists.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product and design decisions have been locked in based on your selections:

- **Confirmed Brand & Catalog**: **LUMEN** — focused on prestige sci-fi, cinematic dramas, and Apple-grade originals with immersive backdrops, rich metadata, and season/episode breakdowns.
- **Confirmed Aesthetic Profile**: **Deep Midnight & Electric Cyan** — deep black (`#07090e`), midnight navy (`#0d131f`), translucent glass panels (`backdrop-blur-xl`, `bg-white/[0.04]` to `bg-white/[0.08]`), low-opacity razor specular borders (`border-white/10`), and electric cyan (`#00f0ff` / `#0ea5e9`) dynamic glows and focus rings.
- **Confirmed Playback Engine**: **Interactive HTML5 Video Player** with real playable video streams, seek controls, ambient screen glow, play/pause, volume/mute sliders, speed toggle (0.5x–2x), fullscreen, keyboard shortcuts (Space, Arrow keys, M, F), skip intro, and auto-synced Continue Watching progress.
- **Local Persistence & Personalization**: User's name, profile avatar, watchlist, favorites, viewing history with playback timestamps, audio/subtitle preferences, and channel favorites stored reliably in browser `localStorage`.

---

## 1. Overview & Core Concept

- **What It Delivers**: A comprehensive, production-grade video streaming web platform featuring 8 dedicated views:
  1. `/welcome` — Ambient glass welcome screen with interactive name prompt and personalized onboarding.
  2. `/home` — Cinematic billboard hero banner, Continue Watching carousel with progress bars, Trending Now, Recommended For You, and Live TV preview.
  3. `/movies` — Filterable movie discovery with category chips, sorting (Rating, Release Date, Title), and quick watchlist toggles.
  4. `/series` — Dedicated TV series portal with season/episode breakdown, badges, and deep metadata.
  5. `/live-tv` — Interactive electronic program guide (EPG), category tabs (News, Sports, Cinema, Docs), active channel video preview, "Now Playing" and "Up Next" schedules.
  6. `/search` — Real-time instant search across titles, cast, directors, and genres with recent query history, category filters, and zero-state suggestions.
  7. `/details/:id` — Immersive full-bleed backdrop modal/page, trailers, cast credits, season/episode selector, like/dislike reactions, and "Play Now" launcher.
  8. `/watch/:id` — Cinematic distraction-free player with custom glass HUD, resume progress, skip intro, speed selector, and episode switcher.
  9. `/profile` — User identity management, name editing, avatar switcher, saved Watchlist grid, Favorites, playback history with clear options, and streaming preferences.
- **Target Audience**: Discerning streaming audiences who value cinematic art direction, tactile glass surfaces, and distraction-free media playback.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **First-Time Welcome**: User arrives at the ambient illuminated welcome gate (`/welcome`), enters their name ("What should we call you?"), chooses an avatar, and clicks "Get Started". The state is saved to `localStorage` and smoothly navigates to `/home`.
2. **Discovery & Browsing**: User browses the cinematic hero banner (with trailer preview and instant play), scrolls horizontal glass carousels with drag/arrow controls, and hovers over posters for specular highlight expansion and quick actions.
3. **Deep Content Exploration**: Clicking any poster opens `/details/:id` or details modal with full synopsis, release year, age rating, duration, genre pills, cast list, and for TV series, interactive episode list cards.
4. **Distraction-Free Video Playback**: Clicking "Play Now" launches `/watch/:id` with real high-definition test video streams (Big Buck Bunny, Tears of Steel, Sintel, Elephant's Dream, Cosmos clips), auto-hiding controls, keyboard shortcuts, and continuous progress recording.
5. **Live Channel Surfing**: User switches channels in `/live-tv`, sees real-time progress of scheduled broadcasts, toggles favorite channels, and inspects upcoming programs in the EPG grid.

### Visual Identity & Theme
- **Color Palette**:
  - Canvas Background: `linear-gradient(135deg, #05070c 0%, #080d1a 50%, #0a0614 100%)`
  - Glass Surface: `backdrop-blur-2xl bg-white/[0.04] hover:bg-white/[0.08]`
  - Specular Hairline: `border border-white/[0.12] shadow-[0_8px_32px_0_rgba(0,0,0,0.45)]`
  - Electric Cyan Accent: `#00f0ff` (Primary CTAs, active indicators, scrubber progress)
  - Atmospheric Violet Accent: `#8b5cf6` (Secondary glow, ambient light reflection)
  - Text: High-contrast pure white (`#ffffff`) for headlines, slate-300 (`#cbd5e1`) for body, slate-500 (`#64748b`) for quiet metadata.
- **Top Bar Contract**:
  - Zone 1: Single text wordmark `LUMEN` in display typeface with glowing cyan jewel accent.
  - Zone 2: 5 clean navigation links (`Home`, `Movies`, `Series`, `Live TV`, `Search`) with active glowing underline indicators.
  - Zone 3: Profile avatar button displaying user's chosen avatar and name pill, opening quick menu or linking to `/profile`.
- **Zero-Pill Metadata**:
  - Movie and series metadata cleanly formatted with bullet separators: `2025 · Sci-Fi · TV-MA · 2h 14m · 4K HDR · Dolby Atmos`.

---

## 3. Key Product Decisions & Trade-Offs

- **Client-Side State & Storage Architecture**:
  - *Chosen Approach*: React Context + custom hooks synchronized with `localStorage`.
  - *Why*: Instant reactivity, zero latency, offline persistence, and seamless session preservation without requiring an external server or database setup for this standalone app.
- **Real Video Playback & Fallback Stream Engine**:
  - *Chosen Approach*: Legitimate, stable MP4 video streams hosted on open CDN sources (Blender Foundation 4K/1080p open cinema masters, Wikimedia commons, and WebM/MP4 test sources) with custom responsive HTML5 video controls.
  - *Why*: Avoids broken videos or CORS errors while ensuring real sound, seeking, pause, and fullscreen capability.
- **Design Restraint**:
  - No low-contrast over-blurred illegibility; all cards have opaque darkened glass underlays (`bg-black/40` or `bg-slate-950/60` underneath `backdrop-blur-xl`) ensuring crisp WCAG AA legibility.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              LUMEN APP                                 │
├────────────────────────────────────────────────────────────────────────┤
│  State & Persistence Layer (localStorage + React Streaming Context)    │
│  - User Profile (name, avatar, autoplay, quality)                      │
│  - Watchlist & Favorites IDs                                           │
│  - Viewing Progress ({ [contentId]: { currentTime, duration, date } }) │
│  - Active Live Channel & Favorite Channels                             │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────┐                           ┌─────────────────────┐
│  Global Navigation    │                           │  Active View Router │
│  - Floating Glass Nav │                           ├─────────────────────┤
│  - Mobile Bottom Bar  │                           │ /welcome            │
│  - User Status Modal  │                           │ /home               │
│  - Global Search Bar  │                           │ /movies             │
└───────────────────────┘                           │ /series             │
                                                    │ /live-tv            │
                                                    │ /details/:id        │
                                                    │ /watch/:id          │
                                                    │ /profile            │
                                                    └─────────────────────┘
```

### Content Data Schema
- **MediaItem**: `id`, `title`, `tagline`, `description`, `type` (`movie` | `series`), `posterUrl`, `backdropUrl`, `videoUrl`, `trailerUrl`, `releaseYear`, `rating`, `duration`, `genres`, `director`, `cast`, `isFeatured`, `isTrending`, `seasons` (`[{ seasonNumber, episodes: [{ episodeNumber, title, duration, description, thumbnail }] }]`).
- **LiveChannel**: `id`, `name`, `callsign`, `logo`, `category`, `videoUrl`, `currentProgram` (`{ title, time, progress, description }`), `schedule` (`[{ time, title, duration }]`).

---

## 5. Verification Plan

1. **Compilation Check**: Run `compile_applet` and `lint_applet` to ensure zero TypeScript, build, or syntax errors.
2. **Flow Verification**:
   - Welcome onboarding -> Enter name -> Home greeting with user's name.
   - Navigation between Home, Movies, Series, Live TV, Search, Details, Player, Profile.
   - Add/remove items from Watchlist and verify persistence in Profile.
   - Launch Player, seek video, toggle audio/fullscreen, return to Home, verify Continue Watching bar shows saved progress.
   - Test Live TV channel switching and EPG schedule display.
