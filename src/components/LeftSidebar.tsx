import React from 'react';
import { useDeckStore } from '../store/useDeckStore';
import { Plus, Copy, Trash2, LayoutTemplate, Grid, Columns, FileText } from 'lucide-react';
import type { SlideLayout } from '../types';


export const LeftSidebar: React.FC = () => {
  const { slides, activeSlideId, setActiveSlideId, addSlide, duplicateSlide, deleteSlide } =
    useDeckStore();

  const getLayoutIcon = (layout: SlideLayout) => {
    switch (layout) {
      case 'hero':
        return <LayoutTemplate className="w-3.5 h-3.5 text-zinc-400" />;
      case 'metrics':
        return <Grid className="w-3.5 h-3.5 text-zinc-400" />;
      case 'two-column':
        return <Columns className="w-3.5 h-3.5 text-zinc-400" />;
      case 'content':
      default:
        return <FileText className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <aside className="w-[215px] min-w-[215px] bg-white border-r border-[#E4E4E7] flex flex-col h-full select-none z-10">
      {/* Header */}
      <div className="p-3 border-b border-[#E4E4E7] flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#71717A] tracking-wider uppercase">
          Slides ({slides.length})
        </span>
        <button
          onClick={() => addSlide()}
          className="p-1 rounded-md text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
          title="Add New Slide"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnails List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {slides.map((slide, index) => {
          const isActive = slide.id === activeSlideId;
          const slideNum = (index + 1).toString().padStart(2, '0');

          return (
            <div
              key={slide.id}
              onClick={() => setActiveSlideId(slide.id)}
              className={`group relative rounded-lg p-2 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-indigo-50/50 border-[#6366F1] shadow-sm'
                  : 'bg-white border-[#E4E4E7] hover:border-zinc-300 hover:bg-[#F4F4F5]/60'
              }`}
            >
              {/* Active bar indicator */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#6366F1] rounded-r" />
              )}

              {/* Number & Controls Header */}
              <div className="flex items-center justify-between mb-1.5 pl-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-medium ${isActive ? 'text-[#6366F1]' : 'text-[#71717A]'}`}>
                    {slideNum}
                  </span>
                  {getLayoutIcon(slide.layout)}
                </div>

                {/* Quick actions (duplicate / delete) */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateSlide(slide.id);
                    }}
                    className="p-0.5 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60"
                    title="Duplicate Slide"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(slide.id);
                      }}
                      className="p-0.5 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Miniature Preview Card */}
              <div className="w-full aspect-[16/9] bg-[#F7F7F8] rounded border border-[#E4E4E7] p-2 flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="h-1.5 w-3/4 bg-zinc-300 rounded mb-1 truncate" />
                  <div className="h-1 w-1/2 bg-zinc-200 rounded" />
                </div>
                
                {/* Visual miniature layout indicator */}
                <div className="flex items-center gap-1 mt-1">
                  {slide.layout === 'metrics' ? (
                    <div className="grid grid-cols-2 gap-0.5 w-full">
                      <div className="h-2 bg-indigo-200/80 rounded" />
                      <div className="h-2 bg-indigo-200/80 rounded" />
                    </div>
                  ) : slide.layout === 'two-column' ? (
                    <div className="flex gap-1 w-full">
                      <div className="h-2 w-1/2 bg-zinc-200 rounded" />
                      <div className="h-2 w-1/2 bg-zinc-200 rounded" />
                    </div>
                  ) : (
                    <div className="h-1 w-2/3 bg-zinc-200 rounded" />
                  )}
                </div>
              </div>

              {/* Title label */}
              <p className={`text-[11px] font-medium mt-1.5 pl-1 truncate ${isActive ? 'text-[#18181B]' : 'text-[#71717A]'}`}>
                {slide.title || 'Untitled Slide'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Add Slide Footer Button */}
      <div className="p-2 border-t border-[#E4E4E7]">
        <button
          onClick={() => addSlide()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-[#71717A] hover:text-[#18181B] bg-[#F4F4F5] hover:bg-zinc-200/60 rounded-lg border border-[#E4E4E7] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add slide</span>
        </button>
      </div>
    </aside>
  );
};
