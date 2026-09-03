import { executeWebMcpTool } from './registry';
import { useDeckStore } from '../store/useDeckStore';

export interface PlannedAction {
  toolName: string;
  args: Record<string, any>;
  description: string;
}

/**
 * Natural language parser fallback for WebMCP Agent Simulator
 */
export function planAgentActions(userPrompt: string): PlannedAction[] {
  const text = userPrompt.trim().toLowerCase();
  const actions: PlannedAction[] = [];

  // Theme matching
  if (text.includes('theme') || text.includes('vapor') || text.includes('acid') || text.includes('cyber') || text.includes('mono')) {
    if (text.includes('vapor') || text.includes('purple')) {
      actions.push({ toolName: 'set_deck_theme', args: { theme: 'vapor' }, description: 'Set theme to vapor' });
    } else if (text.includes('acid') || text.includes('yellow')) {
      actions.push({ toolName: 'set_deck_theme', args: { theme: 'acid' }, description: 'Set theme to acid' });
    } else if (text.includes('cyber') || text.includes('green')) {
      actions.push({ toolName: 'set_deck_theme', args: { theme: 'cyber' }, description: 'Set theme to cyber' });
    } else if (text.includes('mono') || text.includes('black') || text.includes('dark')) {
      actions.push({ toolName: 'set_deck_theme', args: { theme: 'mono' }, description: 'Set theme to mono' });
    }
  }

  // Metric extraction (e.g., "Add a metric showing 87% conversion", "87% conversion", "35% growth", "2M users")
  const metricRegex = /(\d+(?:\.\d+)?%?|\$\d+(?:\.\d+)?[MBk]?|\d+[MBk]?)\s+([a-zA-Z0-9\s]+?)(?:$|,|\.|and|with)/gi;
  const foundMetrics: { value: string; label: string }[] = [];
  let match;
  while ((match = metricRegex.exec(userPrompt)) !== null) {
    if (match[1] && match[2]) {
      const val = match[1].trim();
      const lbl = match[2].trim();
      if (lbl.length < 30 && !['a', 'the', 'slide', 'with', 'showing', 'about'].includes(lbl.toLowerCase())) {
        foundMetrics.push({ value: val, label: lbl.charAt(0).toUpperCase() + lbl.slice(1) });
      }
    }
  }

  // Slide creation matching
  if (text.includes('add a slide') || text.includes('create a slide') || text.includes('new slide') || text.includes('metrics slide')) {
    let title = 'Market Opportunity';
    let layout: 'hero' | 'two-column' | 'metrics' | 'content' = 'hero';

    if (text.includes('market') || text.includes('opportunity')) {
      title = 'Market Opportunity';
    } else if (text.includes('ai') || text.includes('agent')) {
      title = 'AI Agents & Automation';
    } else if (text.includes('revenue') || text.includes('financial') || text.includes('growth')) {
      title = 'Financial & Revenue Growth';
    } else if (text.includes('architecture') || text.includes('tech')) {
      title = 'Technical Architecture';
    } else {
      // Extract title from "about [X]"
      const aboutMatch = text.match(/(?:about|for|named|titled)\s+([^.,;]+)/i);
      if (aboutMatch && aboutMatch[1]) {
        title = aboutMatch[1].split('with')[0].trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }
    }

    if (text.includes('metric') || foundMetrics.length > 0) {
      layout = 'metrics';
    } else if (text.includes('two column') || text.includes('comparison') || text.includes('versus')) {
      layout = 'two-column';
    }

    const initialMetrics = foundMetrics.length > 0 ? foundMetrics : [
      { value: '4.2x', label: 'Growth Rate' },
      { value: '87%', label: 'Retention' },
      { value: '$12M', label: 'ARR Target' },
    ];

    actions.push({
      toolName: 'add_slide',
      args: {
        title,
        subtitle: 'Key strategic focus & growth drivers',
        layout,
        bullets: ['High expansion velocity across key customer accounts', 'Seamless integration with existing developer workflows'],
        metrics: layout === 'metrics' ? initialMetrics : [],
      },
      description: `Create "${title}" slide`,
    });
  } 
  // Update slide matching
  else if (text.includes('make the current slide') || text.includes('update slide') || text.includes('change this slide')) {
    let title = 'AI Agents & WebMCP';
    const aboutMatch = text.match(/(?:about|for)\s+([^.,;]+)/i);
    if (aboutMatch && aboutMatch[1]) {
      title = aboutMatch[1].trim();
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    actions.push({
      toolName: 'update_slide_content',
      args: {
        title,
        subtitle: 'Refreshed slide topic and key messaging',
        bullets: [
          'Autonomous WebMCP tool invocation',
          'Bi-directional state sync with zero visual flicker',
          'Human-in-the-loop inspection and direct editing',
        ],
      },
      description: `Update current slide to "${title}"`,
    });
  } 
  // Metric insertion (without new slide)
  else if (text.includes('metric') || text.includes('conversion') || text.includes('growth')) {
    if (foundMetrics.length > 0) {
      foundMetrics.forEach((m) => {
        actions.push({
          toolName: 'insert_metric_card',
          args: {
            value: m.value,
            label: m.label,
            description: 'Inserted by AI Agent',
          },
          description: `Add ${m.value} ${m.label} metric`,
        });
      });
    } else {
      actions.push({
        toolName: 'insert_metric_card',
        args: {
          value: '87%',
          label: 'Conversion Rate',
          description: 'Quarter-over-quarter improvement',
        },
        description: 'Add 87% Conversion Rate metric',
      });
    }
  }

  // Fallback if no specific action matched
  if (actions.length === 0) {
    actions.push({
      toolName: 'add_slide',
      args: {
        title: userPrompt.length > 30 ? `${userPrompt.slice(0, 30)}...` : userPrompt,
        subtitle: 'Created by WebMCP Agent',
        layout: 'hero',
        bullets: ['Key takeaway 1', 'Key takeaway 2'],
      },
      description: 'Create slide from prompt',
    });
  }

  return actions;
}

/**
 * Execute agent planned tools sequentially with loading updates
 */
export async function runAgentSimulation(userPrompt: string): Promise<void> {
  const store = useDeckStore.getState();
  store.setIsAgentWorking(true, 'Analyzing request...');

  const plannedActions = planAgentActions(userPrompt);

  for (let i = 0; i < plannedActions.length; i++) {
    const action = plannedActions[i];
    store.setIsAgentWorking(true, `Executing ${action.toolName}...`);

    // Simulated short realistic execution delay
    await new Promise((resolve) => setTimeout(resolve, 450));

    await executeWebMcpTool(action.toolName, action.args);
  }

  store.setIsAgentWorking(false, '');
}
