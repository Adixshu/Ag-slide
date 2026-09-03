import { create } from 'zustand';
import type { Slide, ThemeType, ExecutionLog, MetricCard } from '../types';



interface DeckState {
  presentationTitle: string;
  theme: ThemeType;
  slides: Slide[];
  activeSlideId: string;
  logs: ExecutionLog[];
  isAgentWorking: boolean;
  agentStatusText: string;
  webMcpConnected: boolean;
  isPresenting: boolean;

  // Actions
  setPresentationTitle: (title: string) => void;
  setDeckTheme: (theme: ThemeType) => void;
  addSlide: (data?: Partial<Slide>) => Slide;
  updateSlideContent: (slideId: string | undefined, content: Partial<Slide>) => void;
  insertMetricCard: (
    slideId: string | undefined,
    metric: { value: string; label: string; description?: string }
  ) => MetricCard;
  deleteSlide: (slideId: string) => void;
  duplicateSlide: (slideId: string) => void;
  reorderSlides: (slides: Slide[]) => void;
  setActiveSlideId: (id: string) => void;
  addExecutionLog: (log: { toolName: string; status: 'success' | 'error' | 'pending'; args: Record<string, any>; result: string }) => ExecutionLog;
  toggleLogExpanded: (id: string) => void;
  clearLogs: () => void;
  setIsAgentWorking: (isWorking: boolean, text?: string) => void;
  setWebMcpConnected: (connected: boolean) => void;
  setIsPresenting: (presenting: boolean) => void;
  
  // Inline editing helpers
  updateSlideMetric: (slideId: string, metricId: string, newValues: Partial<MetricCard>) => void;
  deleteSlideMetric: (slideId: string, metricId: string) => void;
  updateSlideBullet: (slideId: string, index: number, value: string, column?: 'left' | 'right') => void;
  addSlideBullet: (slideId: string, column?: 'left' | 'right') => void;
  deleteSlideBullet: (slideId: string, index: number, column?: 'left' | 'right') => void;
}

const initialSlides: Slide[] = [
  {
    id: 'slide-1',
    title: 'AI-Native Workflows',
    subtitle: 'Empowering Next-Gen Applications with Autonomous WebMCP Agents',
    layout: 'hero',
    bullets: [
      'Built on WebMCP open protocol for agentic web tools',
      'Real-time bi-directional state synchronization',
      'Instant human + agent collaborative slide mutation',
    ],
    metrics: [],
    notes: 'Opening slide introducing the core mission of Ag-Slide and WebMCP integration.',
  },
  {
    id: 'slide-2',
    title: 'Market Opportunity & Growth',
    subtitle: 'Key performance metrics across active agentic presentation workflows',
    layout: 'metrics',
    bullets: [],
    metrics: [
      { id: 'm-1', value: '4.2x', label: 'Speed Increase', description: 'Faster presentation creation with agent tools' },
      { id: 'm-2', value: '87%', label: 'Workflow Retention', description: 'Weekly active team workspace adoption' },
      { id: 'm-3', value: '12ms', label: 'Tool Latency', description: 'Average WebMCP dispatch execution time' },
      { id: 'm-4', value: '100%', label: 'Schema Validation', description: 'Strict typed tool argument checking' },
    ],
    notes: 'Highlight key stats demonstrating business value and technical performance.',
  },
  {
    id: 'slide-3',
    title: 'Human + Agent Collaboration',
    subtitle: 'Combining direct visual manipulation with structured tool execution',
    layout: 'two-column',
    bullets: [],
    columnLeftBullets: [
      'Direct Canvas Editing',
      'Click to edit titles, subtitles, and metrics inline',
      'Instant visual theme switching and layout selection',
      'Full drag and reorder slide navigation',
    ],
    columnRightBullets: [
      'WebMCP Agent Operations',
      'Structured tool calls mutate presentation live',
      'Autonomous slide generation & metric insertion',
      'Complete execution logs with arguments & schema',
    ],
    metrics: [],
    notes: 'Demonstrate dual control model where user and AI work on the same live state.',
  },
  {
    id: 'slide-4',
    title: 'Architecture & Tool Registry',
    subtitle: 'How WebMCP dispatches typed actions directly to Zustand store',
    layout: 'content',
    bullets: [
      'Agent dispatches structured JSON parameters via WebMCP protocol',
      'Tool Executor validates arguments against registered JSON Schemas',
      'Zustand store applies atomic state mutations to presentation canvas',
      'Execution log captures timestamps, inputs, and results for complete auditability',
    ],
    metrics: [],
    notes: 'Technical architecture breakdown for developer and product review.',
  },
];

const initialLogs: ExecutionLog[] = [
  {
    id: 'log-init-1',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    toolName: 'set_deck_theme',
    status: 'success',
    args: { theme: 'acid' },
    result: 'Theme updated to acid successfully.',
    expanded: false,
  },
  {
    id: 'log-init-2',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    toolName: 'add_slide',
    status: 'success',
    args: { layout: 'metrics', title: 'Market Opportunity & Growth' },
    result: 'Created slide slide-2 with layout metrics.',
    expanded: false,
  },
];

export const useDeckStore = create<DeckState>((set, get) => ({
  presentationTitle: 'AI-Native Presentation Deck',
  theme: 'vapor',
  slides: initialSlides,
  activeSlideId: 'slide-1',
  logs: initialLogs,
  isAgentWorking: false,
  agentStatusText: '',
  webMcpConnected: true,
  isPresenting: false,

  setPresentationTitle: (title) => set({ presentationTitle: title }),
  
  setDeckTheme: (theme) => set({ theme }),

  addSlide: (data) => {
    const slides = get().slides;
    const newId = `slide-${Date.now().toString(36)}`;
    const newSlide: Slide = {
      id: newId,
      title: data?.title || 'New Presentation Slide',
      subtitle: data?.subtitle || 'Add a descriptive subtitle here',
      layout: data?.layout || 'hero',
      bullets: data?.bullets || ['Key point 1', 'Key point 2', 'Key point 3'],
      columnLeftBullets: data?.columnLeftBullets || ['Column 1 point A', 'Column 1 point B'],
      columnRightBullets: data?.columnRightBullets || ['Column 2 point A', 'Column 2 point B'],
      metrics: data?.metrics || [],
      notes: data?.notes || '',
    };

    set({
      slides: [...slides, newSlide],
      activeSlideId: newId,
    });
    return newSlide;
  },

  updateSlideContent: (targetSlideId, content) => {
    const { slides, activeSlideId } = get();
    const idToUpdate = targetSlideId || activeSlideId;
    
    set({
      slides: slides.map((slide) => {
        if (slide.id === idToUpdate) {
          return {
            ...slide,
            ...(content.title !== undefined && { title: content.title }),
            ...(content.subtitle !== undefined && { subtitle: content.subtitle }),
            ...(content.layout !== undefined && { layout: content.layout }),
            ...(content.bullets !== undefined && { bullets: content.bullets }),
            ...(content.columnLeftBullets !== undefined && { columnLeftBullets: content.columnLeftBullets }),
            ...(content.columnRightBullets !== undefined && { columnRightBullets: content.columnRightBullets }),
            ...(content.metrics !== undefined && { metrics: content.metrics }),
            ...(content.notes !== undefined && { notes: content.notes }),
          };
        }
        return slide;
      }),
    });
  },

  insertMetricCard: (targetSlideId, metricData) => {
    const { slides, activeSlideId } = get();
    const idToUpdate = targetSlideId || activeSlideId;
    const newMetric: MetricCard = {
      id: `m-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      value: metricData.value,
      label: metricData.label,
      description: metricData.description || '',
    };

    set({
      slides: slides.map((slide) => {
        if (slide.id === idToUpdate) {
          const updatedMetrics = [...slide.metrics, newMetric];
          // Automatically upgrade layout to metrics if it was hero or content and now has metrics
          const newLayout = slide.metrics.length === 0 && slide.layout !== 'metrics' ? 'metrics' : slide.layout;
          return {
            ...slide,
            layout: newLayout,
            metrics: updatedMetrics,
          };
        }
        return slide;
      }),
    });

    return newMetric;
  },

  deleteSlide: (slideId) => {
    const { slides, activeSlideId } = get();
    if (slides.length <= 1) return; // Keep at least one slide
    const nextSlides = slides.filter((s) => s.id !== slideId);
    const nextActiveId = activeSlideId === slideId ? nextSlides[0].id : activeSlideId;
    set({
      slides: nextSlides,
      activeSlideId: nextActiveId,
    });
  },

  duplicateSlide: (slideId) => {
    const { slides } = get();
    const slideToCopy = slides.find((s) => s.id === slideId);
    if (!slideToCopy) return;

    const newId = `slide-${Date.now().toString(36)}`;
    const copyIndex = slides.findIndex((s) => s.id === slideId);
    const duplicated: Slide = {
      ...slideToCopy,
      id: newId,
      title: `${slideToCopy.title} (Copy)`,
      metrics: slideToCopy.metrics.map((m) => ({ ...m, id: `m-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}` })),
    };

    const newSlides = [...slides];
    newSlides.splice(copyIndex + 1, 0, duplicated);

    set({
      slides: newSlides,
      activeSlideId: newId,
    });
  },

  reorderSlides: (newSlides) => set({ slides: newSlides }),

  setActiveSlideId: (id) => set({ activeSlideId: id }),

  addExecutionLog: ({ toolName, status, args, result }) => {
    const logItem: ExecutionLog = {
      id: `log-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      toolName,
      status,
      args,
      result,
      expanded: false,
    };

    set((state) => ({
      logs: [logItem, ...state.logs],
    }));

    return logItem;
  },

  toggleLogExpanded: (id) => set((state) => ({
    logs: state.logs.map((l) => (l.id === id ? { ...l, expanded: !l.expanded } : l)),
  })),

  clearLogs: () => set({ logs: [] }),

  setIsAgentWorking: (isWorking, text = '') => set({ isAgentWorking: isWorking, agentStatusText: text }),

  setWebMcpConnected: (connected) => set({ webMcpConnected: connected }),

  setIsPresenting: (presenting) => set({ isPresenting: presenting }),

  // Inline editing helpers
  updateSlideMetric: (slideId, metricId, newValues) => {
    set((state) => ({
      slides: state.slides.map((s) => {
        if (s.id === slideId) {
          return {
            ...s,
            metrics: s.metrics.map((m) => (m.id === metricId ? { ...m, ...newValues } : m)),
          };
        }
        return s;
      }),
    }));
  },

  deleteSlideMetric: (slideId, metricId) => {
    set((state) => ({
      slides: state.slides.map((s) => {
        if (s.id === slideId) {
          return {
            ...s,
            metrics: s.metrics.filter((m) => m.id !== metricId),
          };
        }
        return s;
      }),
    }));
  },

  updateSlideBullet: (slideId, index, value, column) => {
    set((state) => ({
      slides: state.slides.map((s) => {
        if (s.id === slideId) {
          if (column === 'left' && s.columnLeftBullets) {
            const copy = [...s.columnLeftBullets];
            copy[index] = value;
            return { ...s, columnLeftBullets: copy };
          } else if (column === 'right' && s.columnRightBullets) {
            const copy = [...s.columnRightBullets];
            copy[index] = value;
            return { ...s, columnRightBullets: copy };
          } else {
            const copy = [...s.bullets];
            copy[index] = value;
            return { ...s, bullets: copy };
          }
        }
        return s;
      }),
    }));
  },

  addSlideBullet: (slideId, column) => {
    set((state) => ({
      slides: state.slides.map((s) => {
        if (s.id === slideId) {
          if (column === 'left') {
            return {
              ...s,
              columnLeftBullets: [...(s.columnLeftBullets || []), 'New point'],
            };
          } else if (column === 'right') {
            return {
              ...s,
              columnRightBullets: [...(s.columnRightBullets || []), 'New point'],
            };
          } else {
            return {
              ...s,
              bullets: [...s.bullets, 'New key point'],
            };
          }
        }
        return s;
      }),
    }));
  },

  deleteSlideBullet: (slideId, index, column) => {
    set((state) => ({
      slides: state.slides.map((s) => {
        if (s.id === slideId) {
          if (column === 'left' && s.columnLeftBullets) {
            return { ...s, columnLeftBullets: s.columnLeftBullets.filter((_, i) => i !== index) };
          } else if (column === 'right' && s.columnRightBullets) {
            return { ...s, columnRightBullets: s.columnRightBullets.filter((_, i) => i !== index) };
          } else {
            return { ...s, bullets: s.bullets.filter((_, i) => i !== index) };
          }
        }
        return s;
      }),
    }));
  },
}));
