export type ThemeType = 'acid' | 'cyber' | 'vapor' | 'mono';

export type SlideLayout = 'hero' | 'two-column' | 'metrics' | 'content';

export interface MetricCard {
  id: string;
  value: string;
  label: string;
  description?: string;
}

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  layout: SlideLayout;
  bullets: string[];
  columnLeftBullets?: string[];
  columnRightBullets?: string[];
  metrics: MetricCard[];
  notes?: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  toolName: string;
  status: 'success' | 'error' | 'pending';
  args: Record<string, any>;
  result: string;
  expanded?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required?: string[];
  };
  schema: object;
}
