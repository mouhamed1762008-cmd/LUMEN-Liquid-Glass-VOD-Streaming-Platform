import React, { useRef } from 'react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaCarouselProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  aspectRatio?: 'poster' | 'backdrop';
  progressMap?: Record<string, number>;
  onOpenDetails?: (item: MediaItem) => void;
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  title,
  subtitle,
  items,
  aspectRatio = 'poster',
  progressMap,
  onOpenDetails,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-6">
      {/* Section Header */}
      <div className="flex items-end justify-between px-4 sm:px-8 mb-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Arrow Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-full glass-panel border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-full glass-panel border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex items-start gap-4 sm:gap-6 px-4 sm:px-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`shrink-0 snap-start ${
              aspectRatio === 'backdrop'
                ? 'w-64 sm:w-80 md:w-96'
                : 'w-40 sm:w-48 md:w-56'
            }`}
          >
            <MediaCard
              item={item}
              aspectRatio={aspectRatio}
              progressPercent={progressMap ? progressMap[item.id] : undefined}
              onOpenDetails={onOpenDetails}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
