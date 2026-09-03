import React, { useState } from 'react';
import { useDeckStore } from '../store/useDeckStore';
import { Layers, Play, Edit2, Check } from 'lucide-react';


export const TopBar: React.FC = () => {
  const {
    presentationTitle,
    setPresentationTitle,
    webMcpConnected,
    setIsPresenting,
  } = useDeckStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(presentationTitle);

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      setPresentationTitle(tempTitle.trim());
    } else {
      setTempTitle(presentationTitle);
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 bg-white border-b border-[#E4E4E7] px-4 flex items-center justify-between select-none z-20">
      {/* Left: Brand / Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
          <Layers className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm text-[#18181B] tracking-tight">Ag-Slide</span>
          <span className="text-[11px] text-[#71717A] font-medium hidden sm:inline-block px-1.5 py-0.5 bg-[#F4F4F5] rounded border border-[#E4E4E7]">
            AI Studio
          </span>
        </div>
      </div>

      {/* Center: Presentation Name */}
      <div className="flex items-center gap-1.5 max-w-md">
        {isEditingTitle ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTempTitle(presentationTitle);
                  setIsEditingTitle(false);
                }
              }}
              onBlur={handleTitleSubmit}
              autoFocus
              className="text-sm font-medium text-[#18181B] bg-[#F4F4F5] border border-[#6366F1] rounded px-2.5 py-1 outline-none w-64 shadow-sm"
            />
            <button
              onClick={handleTitleSubmit}
              className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Save Title"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setTempTitle(presentationTitle);
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-2 group px-2.5 py-1 rounded-md hover:bg-[#F4F4F5] transition-colors"
            title="Click to edit presentation name"
          >
            <span className="text-sm font-medium text-[#18181B] truncate max-w-[280px]">
              {presentationTitle}
            </span>
            <Edit2 className="w-3.5 h-3.5 text-[#71717A] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* Right: WebMCP Status & Actions */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
            webMcpConnected
              ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <span className="relative flex h-2 w-2">
            {webMcpConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                webMcpConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </span>
          <span>WEBMCP CONNECTED</span>
        </div>

        <button
          onClick={() => setIsPresenting(true)}
          className="flex items-center gap-1.5 text-xs font-medium bg-[#6366F1] text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors shadow-sm shadow-indigo-500/10 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Present</span>
        </button>
      </div>
    </header>
  );
};
