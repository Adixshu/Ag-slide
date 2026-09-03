import React from 'react';
import { useDeckStore } from '../store/useDeckStore';
import { ChevronLeft, ChevronRight, LayoutTemplate, Grid, Columns, FileText, RefreshCw } from 'lucide-react';
import type { SlideLayout, ThemeType } from '../types';


export const CanvasToolbar: React.FC = () => {
  const { slides, activeSlideId, setActiveSlideId, theme, setDeckTheme, updateSlideContent } =
    useDeckStore();

  const currentIndex = slides.findIndex((s) => s.id === activeSlideId);
  const activeSlide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveSlideId(slides[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setActiveSlideId(slides[currentIndex + 1].id);
    }
  };

  const handleLayoutChange = (layout: SlideLayout) => {
    if (activeSlide) {
      updateSlideContent(activeSlide.id, { layout });
    }
  };

  const layouts: { id: SlideLayout; label: string; icon: React.ReactNode }[] = [
    { id: 'hero', label: 'Hero', icon: <LayoutTemplate className="w-3.5 h-3.5" /> },
    { id: 'content', label: 'Content', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'two-column', label: '2-Column', icon: <Columns className="w-3.5 h-3.5" /> },
    { id: 'metrics', label: 'Metrics', icon: <Grid className="w-3.5 h-3.5" /> },
  ];

  const themes: { id: ThemeType; label: string; color: string }[] = [
    { id: 'acid', label: 'Acid', color: 'bg-amber-400' },
    { id: 'cyber', label: 'Cyber', color: 'bg-emerald-400' },
    { id: 'vapor', label: 'Vapor', color: 'bg-purple-500' },
    { id: 'mono', label: 'Mono', color: 'bg-zinc-800' },
  ];

  return (
    <div className="h-12 bg-white/90 backdrop-blur border border-[#E4E4E7] rounded-xl px-3 flex items-center justify-between shadow-sm select-none z-10 max-w-4xl mx-auto w-full mb-3">
      {/* Left: Prev / Next & Index */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex <= 0}
          className="p-1 rounded-md text-zinc-600 hover:bg-[#F4F4F5] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-medium text-[#71717A] min-w-[45px] text-center">
          {currentIndex + 1} / {slides.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex >= slides.length - 1}
          className="p-1 rounded-md text-zinc-600 hover:bg-[#F4F4F5] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Layout Selector */}
      <div className="flex items-center gap-1 bg-[#F4F4F5] p-1 rounded-lg border border-[#E4E4E7]">
        {layouts.map((item) => {
          const isSelected = activeSlide?.layout === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleLayoutChange(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-white text-[#18181B] shadow-sm font-semibold'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Theme Selector & Sync Badge */}
      <div className="flex items-center gap-3">
        {/* Theme pills */}
        <div className="flex items-center gap-1">
          {themes.map((t) => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setDeckTheme(t.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-white text-zinc-600 border-[#E4E4E7] hover:bg-zinc-50'
                }`}
                title={`Switch to ${t.label} theme`}
              >
                <span className={`w-2 h-2 rounded-full ${t.color}`} />
                <span className="capitalize text-[11px]">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sync status */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#71717A] font-medium pl-2 border-l border-[#E4E4E7]">
          <RefreshCw className="w-3 h-3 text-emerald-500 animate-spin-slow" />
          <span className="tracking-tight uppercase text-[10px] text-zinc-400">Synced</span>
        </div>
      </div>
    </div>
  );
};
