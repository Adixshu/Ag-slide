import React, { useEffect } from 'react';
import { useDeckStore } from '../store/useDeckStore';
import { X, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import type { ThemeType } from '../types';


export const PresentModal: React.FC = () => {
  const { isPresenting, setIsPresenting, slides, activeSlideId, setActiveSlideId, theme } =
    useDeckStore();

  const currentIndex = slides.findIndex((s) => s.id === activeSlideId);
  const slide = slides[currentIndex] || slides[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPresenting) return;

      if (e.key === 'Escape') {
        setIsPresenting(false);
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentIndex < slides.length - 1) {
          setActiveSlideId(slides[currentIndex + 1].id);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setActiveSlideId(slides[currentIndex - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, currentIndex, slides, setActiveSlideId, setIsPresenting]);

  if (!isPresenting || !slide) return null;

  const getThemeClasses = (t: ThemeType) => {
    switch (t) {
      case 'acid':
        return {
          bg: 'bg-[#FEFCE8]',
          text: 'text-amber-950',
          accentBg: 'bg-amber-500',
          cardBg: 'bg-amber-100/60 border-amber-200',
        };
      case 'cyber':
        return {
          bg: 'bg-[#ECFDF5]',
          text: 'text-emerald-950',
          accentBg: 'bg-emerald-500',
          cardBg: 'bg-emerald-100/60 border-emerald-200',
        };
      case 'vapor':
        return {
          bg: 'bg-[#F5F3FF]',
          text: 'text-purple-950',
          accentBg: 'bg-purple-500',
          cardBg: 'bg-purple-100/60 border-purple-200',
        };
      case 'mono':
      default:
        return {
          bg: 'bg-zinc-900',
          text: 'text-zinc-50',
          accentBg: 'bg-zinc-100',
          cardBg: 'bg-zinc-800/80 border-zinc-700',
        };
    }
  };

  const themeStyle = getThemeClasses(theme);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between p-8 sm:p-16 select-none transition-colors duration-300 ${themeStyle.bg}`}>
      {/* Top Header / Exit */}
      <div className="flex items-center justify-between z-10">
        <span className={`text-xs font-mono font-medium opacity-60 uppercase tracking-widest ${themeStyle.text}`}>
          Ag-Slide Presenter • {currentIndex + 1} of {slides.length}
        </span>
        <button
          onClick={() => setIsPresenting(false)}
          className={`p-2 rounded-xl border border-current/20 hover:bg-black/5 transition-colors ${themeStyle.text}`}
          title="Exit Presentation (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Slide Content Presentation */}
      <div className="max-w-5xl w-full mx-auto my-auto flex flex-col justify-center animate-in fade-in zoom-in-95 duration-200">
        <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 ${themeStyle.text}`}>
          {slide.title}
        </h1>
        
        {slide.subtitle && (
          <p className={`text-xl sm:text-2xl opacity-75 font-normal mb-8 max-w-3xl ${themeStyle.text}`}>
            {slide.subtitle}
          </p>
        )}

        {/* Dynamic Presentation Layout */}
        {slide.layout === 'hero' || slide.layout === 'content' ? (
          <div className="space-y-4 max-w-3xl">
            {slide.bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-4 text-lg sm:text-xl font-medium">
                <span className={`w-3 h-3 rounded-full mt-2 shrink-0 ${themeStyle.accentBg}`} />
                <span className={themeStyle.text}>{b}</span>
              </div>
            ))}
          </div>
        ) : slide.layout === 'two-column' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className={`rounded-2xl p-6 border ${themeStyle.cardBg}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 opacity-70 ${themeStyle.text}`}>
                Human Controls
              </h3>
              <div className="space-y-3">
                {(slide.columnLeftBullets || slide.bullets).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-base">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className={themeStyle.text}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl p-6 border ${themeStyle.cardBg}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 opacity-70 ${themeStyle.text}`}>
                WebMCP Agent
              </h3>
              <div className="space-y-3">
                {(slide.columnRightBullets || slide.bullets).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-base">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className={themeStyle.text}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {slide.metrics.map((m) => (
              <div key={m.id} className={`rounded-2xl p-6 border ${themeStyle.cardBg}`}>
                <div className={`text-4xl sm:text-5xl font-extrabold mb-2 ${themeStyle.text}`}>
                  {m.value}
                </div>
                <div className={`text-sm font-semibold opacity-90 ${themeStyle.text}`}>
                  {m.label}
                </div>
                {m.description && (
                  <div className={`text-xs opacity-60 mt-1 ${themeStyle.text}`}>
                    {m.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav Controls */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => currentIndex > 0 && setActiveSlideId(slides[currentIndex - 1].id)}
            disabled={currentIndex === 0}
            className={`p-2 rounded-xl border border-current/20 disabled:opacity-20 transition-opacity ${themeStyle.text}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => currentIndex < slides.length - 1 && setActiveSlideId(slides[currentIndex + 1].id)}
            disabled={currentIndex === slides.length - 1}
            className={`p-2 rounded-xl border border-current/20 disabled:opacity-20 transition-opacity ${themeStyle.text}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <span className={`text-xs font-mono opacity-50 ${themeStyle.text}`}>
          Use Arrow Keys or Space to Navigate
        </span>
      </div>
    </div>
  );
};
