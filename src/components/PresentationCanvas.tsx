import React, { useState } from 'react';
import { useDeckStore } from '../store/useDeckStore';
import { Plus, Trash2, Edit3, Sparkles, Check } from 'lucide-react';
import type { ThemeType } from '../types';


export const PresentationCanvas: React.FC = () => {
  const {
    slides,
    activeSlideId,
    theme,
    updateSlideContent,
    insertMetricCard,
    updateSlideMetric,
    deleteSlideMetric,
    updateSlideBullet,
    addSlideBullet,
    deleteSlideBullet,
  } = useDeckStore();

  const slide = slides.find((s) => s.id === activeSlideId) || slides[0];

  const [editingField, setEditingField] = useState<string | null>(null);

  if (!slide) return null;

  // Theme style classes
  const getThemeClasses = (t: ThemeType) => {
    switch (t) {
      case 'acid':
        return {
          pill: 'bg-amber-50 text-amber-700 border-amber-200/80',
          accentBg: 'bg-amber-500',
          accentText: 'text-amber-600',
          cardHover: 'hover:border-amber-300',
          metricCard: 'bg-amber-50/40 border-amber-200/60',
        };
      case 'cyber':
        return {
          pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          accentBg: 'bg-emerald-500',
          accentText: 'text-emerald-600',
          cardHover: 'hover:border-emerald-300',
          metricCard: 'bg-emerald-50/40 border-emerald-200/60',
        };
      case 'vapor':
        return {
          pill: 'bg-purple-50 text-purple-700 border-purple-200/80',
          accentBg: 'bg-purple-500',
          accentText: 'text-purple-600',
          cardHover: 'hover:border-purple-300',
          metricCard: 'bg-purple-50/40 border-purple-200/60',
        };
      case 'mono':
      default:
        return {
          pill: 'bg-zinc-100 text-zinc-800 border-zinc-200',
          accentBg: 'bg-zinc-900',
          accentText: 'text-zinc-900',
          cardHover: 'hover:border-zinc-400',
          metricCard: 'bg-zinc-50 border-zinc-200',
        };
    }
  };

  const themeStyle = getThemeClasses(theme);

  return (
    <div className="w-full flex-1 flex items-center justify-center p-4 min-h-[480px]">
      <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-2xl border border-[#E4E4E7] shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
        
        {/* Subtle Theme Accent Top Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${themeStyle.accentBg}`} />

        {/* Top Header Section (Title & Subtitle) */}
        <div>
          {/* Theme Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${themeStyle.pill}`}>
              {theme} • {slide.layout}
            </span>
          </div>

          {/* Editable Title */}
          <div className="relative group mb-2">
            {editingField === 'title' ? (
              <input
                type="text"
                value={slide.title}
                onChange={(e) => updateSlideContent(slide.id, { title: e.target.value })}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                autoFocus
                className="w-full text-3xl sm:text-4xl font-bold text-[#18181B] bg-[#F4F4F5] border-2 border-[#6366F1] rounded-lg px-3 py-1 outline-none shadow-sm"
              />
            ) : (
              <h1
                onClick={() => setEditingField('title')}
                className="text-3xl sm:text-4xl font-bold text-[#18181B] tracking-tight hover:bg-[#F4F4F5]/60 cursor-pointer rounded-lg px-2 py-1 -ml-2 transition-colors flex items-center justify-between"
                title="Click to edit title"
              >
                <span>{slide.title || 'Click to add slide title'}</span>
                <Edit3 className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
              </h1>
            )}
          </div>

          {/* Editable Subtitle */}
          <div className="relative group">
            {editingField === 'subtitle' ? (
              <input
                type="text"
                value={slide.subtitle}
                onChange={(e) => updateSlideContent(slide.id, { subtitle: e.target.value })}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                autoFocus
                className="w-full text-base sm:text-lg text-[#71717A] bg-[#F4F4F5] border-2 border-[#6366F1] rounded-lg px-3 py-1 outline-none shadow-sm"
              />
            ) : (
              <p
                onClick={() => setEditingField('subtitle')}
                className="text-base sm:text-lg text-[#71717A] font-normal hover:bg-[#F4F4F5]/60 cursor-pointer rounded-lg px-2 py-1 -ml-2 transition-colors flex items-center justify-between"
                title="Click to edit subtitle"
              >
                <span>{slide.subtitle || 'Click to add subtitle'}</span>
                <Edit3 className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Layout Content Area */}
        <div className="flex-1 my-6 overflow-y-auto pr-1">
          {/* LAYOUT 1: HERO */}
          {slide.layout === 'hero' && (
            <div className="space-y-3 mt-2">
              {slide.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${themeStyle.accentBg}`} />
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => updateSlideBullet(slide.id, idx, e.target.value)}
                    className="flex-1 text-base text-[#18181B] bg-transparent hover:bg-[#F4F4F5]/70 focus:bg-[#F4F4F5] focus:border-[#6366F1] border border-transparent rounded px-2 py-1 outline-none transition-colors"
                  />
                  <button
                    onClick={() => deleteSlideBullet(slide.id, idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-600 transition-opacity"
                    title="Remove bullet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addSlideBullet(slide.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#71717A] hover:text-[#6366F1] mt-2 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add key point</span>
              </button>
            </div>
          )}

          {/* LAYOUT 2: CONTENT */}
          {slide.layout === 'content' && (
            <div className="space-y-3 mt-2">
              {slide.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold text-white shrink-0 ${themeStyle.accentBg}`}>
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => updateSlideBullet(slide.id, idx, e.target.value)}
                    className="flex-1 text-base text-[#18181B] bg-transparent hover:bg-[#F4F4F5]/70 focus:bg-[#F4F4F5] focus:border-[#6366F1] border border-transparent rounded px-2 py-1 outline-none transition-colors"
                  />
                  <button
                    onClick={() => deleteSlideBullet(slide.id, idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-600 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addSlideBullet(slide.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#71717A] hover:text-[#6366F1] mt-2 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add bullet point</span>
              </button>
            </div>
          )}

          {/* LAYOUT 3: TWO-COLUMN */}
          {slide.layout === 'two-column' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
              {/* Left Column */}
              <div className="bg-[#F4F4F5]/60 border border-[#E4E4E7] rounded-xl p-4 space-y-2">
                <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider block mb-2">
                  Human Workflow
                </span>
                {(slide.columnLeftBullets || slide.bullets).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <Check className={`w-3.5 h-3.5 shrink-0 ${themeStyle.accentText}`} />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateSlideBullet(slide.id, idx, e.target.value, 'left')}
                      className="flex-1 text-xs text-[#18181B] bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-[#6366F1] rounded px-1.5 py-0.5 outline-none"
                    />
                  </div>
                ))}
                <button
                  onClick={() => addSlideBullet(slide.id, 'left')}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#71717A] hover:text-[#6366F1] pt-1"
                >
                  <Plus className="w-3 h-3" /> Add item
                </button>
              </div>

              {/* Right Column */}
              <div className="bg-[#F4F4F5]/60 border border-[#E4E4E7] rounded-xl p-4 space-y-2">
                <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider block mb-2">
                  WebMCP Agent
                </span>
                {(slide.columnRightBullets || slide.bullets).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <Sparkles className={`w-3.5 h-3.5 shrink-0 ${themeStyle.accentText}`} />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateSlideBullet(slide.id, idx, e.target.value, 'right')}
                      className="flex-1 text-xs text-[#18181B] bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-[#6366F1] rounded px-1.5 py-0.5 outline-none"
                    />
                  </div>
                ))}
                <button
                  onClick={() => addSlideBullet(slide.id, 'right')}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#71717A] hover:text-[#6366F1] pt-1"
                >
                  <Plus className="w-3 h-3" /> Add item
                </button>
              </div>
            </div>
          )}

          {/* LAYOUT 4: METRICS */}
          {slide.layout === 'metrics' && (
            <div className="mt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {slide.metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className={`relative group rounded-xl p-4 border transition-all ${themeStyle.metricCard} ${themeStyle.cardHover}`}
                  >
                    <button
                      onClick={() => deleteSlideMetric(slide.id, metric.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-600 transition-opacity"
                      title="Delete Metric"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) =>
                        updateSlideMetric(slide.id, metric.id, { value: e.target.value })
                      }
                      className="w-full text-2xl sm:text-3xl font-extrabold text-[#18181B] bg-transparent hover:bg-white/70 focus:bg-white border border-transparent focus:border-[#6366F1] rounded px-1 outline-none mb-1 font-sans"
                    />

                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) =>
                        updateSlideMetric(slide.id, metric.id, { label: e.target.value })
                      }
                      className="w-full text-xs font-semibold text-[#71717A] bg-transparent hover:bg-white/70 focus:bg-white border border-transparent focus:border-[#6366F1] rounded px-1 outline-none"
                    />

                    <input
                      type="text"
                      value={metric.description || ''}
                      placeholder="Add subtext..."
                      onChange={(e) =>
                        updateSlideMetric(slide.id, metric.id, { description: e.target.value })
                      }
                      className="w-full text-[10px] text-zinc-400 bg-transparent hover:bg-white/70 focus:bg-white border border-transparent focus:border-[#6366F1] rounded px-1 mt-1 outline-none"
                    />
                  </div>
                ))}

                {/* Add Metric Button Card */}
                {slide.metrics.length < 6 && (
                  <button
                    onClick={() =>
                      insertMetricCard(slide.id, {
                        value: '99%',
                        label: 'New Metric',
                        description: 'Context description',
                      })
                    }
                    className="border-2 border-dashed border-[#E4E4E7] hover:border-[#6366F1] rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-[#6366F1] transition-colors group min-h-[100px]"
                  >
                    <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Add Metric</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info / live sync tag */}
        <div className="pt-3 border-t border-[#E4E4E7]/70 flex items-center justify-between text-xs text-[#71717A]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-zinc-400">AG-SLIDE CANVAS</span>
            <span className="text-zinc-300">•</span>
            <span className="text-[11px]">Direct state mutation enabled</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              WEBMCP READY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
