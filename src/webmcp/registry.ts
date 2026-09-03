import type { ToolDefinition, ThemeType, SlideLayout } from '../types';
import { useDeckStore } from '../store/useDeckStore';


export const REGISTERED_TOOLS: ToolDefinition[] = [
  {
    name: 'add_slide',
    description: 'Add a new slide to the presentation deck with specified layout, title, and content.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Title of the new slide' },
        subtitle: { type: 'string', description: 'Subtitle or secondary heading' },
        layout: {
          type: 'string',
          description: 'Visual layout type',
          enum: ['hero', 'two-column', 'metrics', 'content'],
        },
        bullets: { type: 'array', description: 'List of bullet points for the slide' },
        metrics: {
          type: 'array',
          description: 'Metric cards to include if layout is metrics',
        },
      },
      required: ['title'],
    },
    schema: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Market Opportunity & Growth' },
        subtitle: { type: 'string', example: 'Key stats across enterprise segments' },
        layout: { type: 'string', enum: ['hero', 'two-column', 'metrics', 'content'] },
        bullets: { type: 'array', items: { type: 'string' } },
        metrics: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', example: '87%' },
              label: { type: 'string', example: 'Conversion Rate' },
              description: { type: 'string', example: 'Q3 Enterprise cohort' },
            },
          },
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'update_slide_content',
    description: 'Update text, title, layout, or bullets of the current active slide or a specified target slide.',
    parameters: {
      type: 'object',
      properties: {
        slideId: { type: 'string', description: 'ID of slide to update (defaults to active slide)' },
        title: { type: 'string', description: 'New slide title' },
        subtitle: { type: 'string', description: 'New slide subtitle' },
        layout: { type: 'string', description: 'Updated layout type', enum: ['hero', 'two-column', 'metrics', 'content'] },
        bullets: { type: 'array', description: 'Updated bullet point array' },
      },
    },
    schema: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        slideId: { type: 'string', example: 'slide-1' },
        title: { type: 'string', example: 'Updated AI Strategy' },
        subtitle: { type: 'string', example: 'Refreshed roadmap for 2026' },
        layout: { type: 'string', enum: ['hero', 'two-column', 'metrics', 'content'] },
        bullets: { type: 'array', items: { type: 'string' } },
      },
    },
  },
  {
    name: 'set_deck_theme',
    description: 'Change presentation deck visual theme across acid, cyber, vapor, and mono styles.',
    parameters: {
      type: 'object',
      properties: {
        theme: {
          type: 'string',
          description: 'Target theme name',
          enum: ['acid', 'cyber', 'vapor', 'mono'],
        },
      },
      required: ['theme'],
    },
    schema: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        theme: { type: 'string', enum: ['acid', 'cyber', 'vapor', 'mono'], example: 'vapor' },
      },
      required: ['theme'],
    },
  },
  {
    name: 'insert_metric_card',
    description: 'Insert a new key metric card (large value, label, subtext) into the active slide.',
    parameters: {
      type: 'object',
      properties: {
        slideId: { type: 'string', description: 'Target slide ID (defaults to active slide)' },
        value: { type: 'string', description: 'Metric display value (e.g. 87%, $4.2M, 10x)' },
        label: { type: 'string', description: 'Metric short label' },
        description: { type: 'string', description: 'Optional context or comparison subtext' },
      },
      required: ['value', 'label'],
    },
    schema: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        slideId: { type: 'string', example: 'slide-2' },
        value: { type: 'string', example: '87%' },
        label: { type: 'string', example: 'Conversion Rate' },
        description: { type: 'string', example: 'Up 14% quarter-over-quarter' },
      },
      required: ['value', 'label'],
    },
  },
];

/**
 * Execute WebMCP Tool call against Zustand store
 */
export async function executeWebMcpTool(toolName: string, args: Record<string, any>): Promise<{ success: boolean; result: string }> {
  const store = useDeckStore.getState();

  try {
    switch (toolName) {
      case 'add_slide': {
        const layout: SlideLayout = args.layout || 'hero';
        const newSlide = store.addSlide({
          title: args.title || 'New Slide',
          subtitle: args.subtitle || 'Generated by WebMCP Agent',
          layout: layout,
          bullets: Array.isArray(args.bullets) ? args.bullets : ['Key point 1', 'Key point 2'],
          metrics: Array.isArray(args.metrics)
            ? args.metrics.map((m: any, i: number) => ({
                id: `m-agent-${Date.now()}-${i}`,
                value: m.value || '100%',
                label: m.label || 'Metric',
                description: m.description || '',
              }))
            : [],
        });

        const resultMsg = `Created slide "${newSlide.title}" (${newSlide.id}) with layout ${layout}.`;
        store.addExecutionLog({
          toolName: 'add_slide',
          status: 'success',
          args,
          result: resultMsg,
        });
        return { success: true, result: resultMsg };
      }

      case 'update_slide_content': {
        const targetId = args.slideId || store.activeSlideId;
        store.updateSlideContent(targetId, {
          ...(args.title && { title: args.title }),
          ...(args.subtitle && { subtitle: args.subtitle }),
          ...(args.layout && { layout: args.layout as SlideLayout }),
          ...(Array.isArray(args.bullets) && { bullets: args.bullets }),
        });

        const resultMsg = `Updated content on slide ${targetId}.`;
        store.addExecutionLog({
          toolName: 'update_slide_content',
          status: 'success',
          args,
          result: resultMsg,
        });
        return { success: true, result: resultMsg };
      }

      case 'set_deck_theme': {
        const validThemes: ThemeType[] = ['acid', 'cyber', 'vapor', 'mono'];
        const targetTheme: ThemeType = validThemes.includes(args.theme as ThemeType)
          ? (args.theme as ThemeType)
          : 'vapor';

        store.setDeckTheme(targetTheme);
        const resultMsg = `Theme changed to ${targetTheme}.`;
        store.addExecutionLog({
          toolName: 'set_deck_theme',
          status: 'success',
          args: { theme: targetTheme },
          result: resultMsg,
        });
        return { success: true, result: resultMsg };
      }

      case 'insert_metric_card': {
        const targetId = args.slideId || store.activeSlideId;
        const insertedMetric = store.insertMetricCard(targetId, {
          value: args.value || '99%',
          label: args.label || 'Metric',
          description: args.description || '',
        });

        const resultMsg = `Inserted metric card "${insertedMetric.value} ${insertedMetric.label}" into slide ${targetId}.`;
        store.addExecutionLog({
          toolName: 'insert_metric_card',
          status: 'success',
          args,
          result: resultMsg,
        });
        return { success: true, result: resultMsg };
      }

      default: {
        const errMsg = `Unknown tool name: ${toolName}`;
        store.addExecutionLog({
          toolName,
          status: 'error',
          args,
          result: errMsg,
        });
        return { success: false, result: errMsg };
      }
    }
  } catch (err: any) {
    const errorMsg = err?.message || 'Error executing tool';
    store.addExecutionLog({
      toolName,
      status: 'error',
      args,
      result: errorMsg,
    });
    return { success: false, result: errorMsg };
  }
}

/**
 * Register tools with browser WebMCP environment if API is injected
 */
export function registerWebMcpToolsWithBrowser() {
  if (typeof window !== 'undefined') {
    const windowMcp = (window as any).webMcp || (window as any).mcp;
    if (windowMcp && typeof windowMcp.registerTool === 'function') {
      REGISTERED_TOOLS.forEach((tool) => {
        windowMcp.registerTool({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
          handler: async (args: Record<string, any>) => {
            const res = await executeWebMcpTool(tool.name, args);
            return res;
          },
        });
      });
      useDeckStore.getState().setWebMcpConnected(true);
    }
  }
}
