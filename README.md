# AG-Slide

Ag-Slide is an AI-native presentation workspace for building, editing, and presenting slide decks alongside structured WebMCP agent actions. Humans can edit the canvas directly while an agent creates slides, changes the deck theme, and inserts metrics into the same live state.

<img width="2528" height="1696" alt="Gemini_Generated_Image_z5nvxvz5nvxvz5nv" src="https://github.com/user-attachments/assets/89bb7c76-f087-47db-8868-df749da580e6" />


## Highlights

- Visual slide editor with thumbnail navigation, inline text and metric editing, duplication, deletion, and drag-to-reorder support
- Four slide layouts: `hero`, `content`, `two-column`, and `metrics`
- Four visual themes: `acid`, `cyber`, `vapor`, and `mono`
- Presenter mode with fullscreen navigation using the arrow keys or Space
- Agent Inspector showing registered tools, JSON Schemas, execution arguments, results, and timestamps
- Natural-language agent simulator with quick prompts for common deck changes
- Optional browser WebMCP registration when a compatible `window.webMcp` API is available
- Zustand-powered shared state so human edits and agent operations update the same presentation immediately

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- A modern browser

## Getting Started

```bash
git clone <repository-url>
cd Ag-slide
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement |
| `npm run build` | Type-check the project and create a production build in `dist/` |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Serve the production build locally |

## Using Ag-Slide

1. Select a slide from the left sidebar.
2. Edit the presentation title, slide text, bullets, and metrics directly on the canvas.
3. Use the canvas toolbar to choose a layout or theme.
4. Open the Agent Inspector to inspect available tools and activity.
5. Enter a request in the agent input, or choose a quick prompt. Press Enter to run it; use Shift+Enter for a new line.
6. Select **Present** to open presenter mode. Navigate with the on-screen controls, Arrow keys, or Space. Press Escape to exit.

Example prompts:

```text
Create a slide about market opportunity with three metrics
Change the deck to vapor
Add a 42% conversion metric to this slide
Make the current slide about AI agents
```

## WebMCP Tools

The tool registry is defined in [`src/webmcp/registry.ts`](src/webmcp/registry.ts). Each tool has a typed parameter definition and a JSON Schema visible in the Agent Inspector.

| Tool | Purpose | Main parameters |
| --- | --- | --- |
| `add_slide` | Add and activate a new slide | `title`, `subtitle`, `layout`, `bullets`, `metrics` |
| `update_slide_content` | Update the active or specified slide | `slideId`, `title`, `subtitle`, `layout`, `bullets` |
| `set_deck_theme` | Change the deck theme | `theme`: `acid`, `cyber`, `vapor`, or `mono` |
| `insert_metric_card` | Add a metric to the active or specified slide | `slideId`, `value`, `label`, `description` |

When the browser exposes `window.webMcp`, Ag-Slide registers these tools on startup. Without that API, the built-in simulator remains available through the Agent Inspector.

## Architecture

```text
React components
      |
      v
Zustand deck store <---- WebMCP tool executor
      |                         ^
      v                         |
Presentation canvas      Agent simulator
                                ^
                                |
                         Natural-language prompt
```

- [`src/store/useDeckStore.ts`](src/store/useDeckStore.ts) owns deck state and mutation actions.
- [`src/components/`](src/components/) contains the editor, navigation, toolbar, inspector, and presenter UI.
- [`src/webmcp/registry.ts`](src/webmcp/registry.ts) defines and executes the registered tools.
- [`src/webmcp/agentSimulator.ts`](src/webmcp/agentSimulator.ts) turns supported prompts into sequential tool actions.
- [`src/types/index.ts`](src/types/index.ts) defines slides, metrics, themes, layouts, logs, and tool definitions.

## Project Structure

```text
src/
├── components/       Editor, toolbars, inspector, and presenter UI
├── store/            Zustand deck state and actions
├── types/            Shared TypeScript domain types
└── webmcp/           Tool registry and natural-language simulator
```

## Current Scope

Ag-Slide is a client-side prototype. Deck state currently lives in memory and is reset when the page reloads. The simulator uses a local rule-based parser; an external model or backend is not required. Browser WebMCP availability depends on the host environment injecting the API.

## License

No license has been specified yet.
