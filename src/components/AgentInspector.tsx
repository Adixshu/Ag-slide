import React, { useState } from 'react';
import { useDeckStore } from '../store/useDeckStore';
import { REGISTERED_TOOLS } from '../webmcp/registry';
import { runAgentSimulation } from '../webmcp/agentSimulator';
import {
  Wand2,
  ChevronDown,
  ChevronRight,
  Send,
  CheckCircle2,
  XCircle,
  Code,
  Terminal,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

export const AgentInspector: React.FC = () => {
  const { logs, isAgentWorking, agentStatusText, toggleLogExpanded, clearLogs } =
    useDeckStore();


  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [copiedSchemaTool, setCopiedSchemaTool] = useState<string | null>(null);

  const handleSendPrompt = async () => {
    if (!promptInput.trim() || isAgentWorking) return;
    const text = promptInput.trim();
    setPromptInput('');
    await runAgentSimulation(text);
  };

  const copySchemaToClipboard = (toolName: string, schema: object) => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopiedSchemaTool(toolName);
    setTimeout(() => setCopiedSchemaTool(null), 2000);
  };

  const quickPrompts = [
    'Create a slide about market opportunity with three metrics',
    'Change the deck to vapor',
    'Add a 42% conversion metric to this slide',
    'Make the current slide about AI agents',
  ];

  return (
    <aside className="w-[340px] min-w-[340px] bg-white border-l border-[#E4E4E7] flex flex-col h-full select-none z-10">
      {/* Header */}
      <div className="p-3.5 border-b border-[#E4E4E7] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366F1]">
            <Wand2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-[#18181B] tracking-tight">Agent Inspector</h2>
            <p className="text-[10px] text-[#71717A]">WebMCP Tool Registry & Execution</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected</span>
        </div>
      </div>

      {/* Main Content Area (Tools + Activity Logs) */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E4E4E7]">
        {/* Tools Registry Section */}
        <div className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[#71717A]" />
              <span className="text-[11px] font-semibold text-[#71717A] tracking-wider uppercase">
                Tools ({REGISTERED_TOOLS.length})
              </span>
            </div>
            <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-medium">
              WebMCP Registered
            </span>
          </div>

          <div className="space-y-2">
            {REGISTERED_TOOLS.map((tool) => {
              const isExpanded = expandedTool === tool.name;
              return (
                <div
                  key={tool.name}
                  className="rounded-lg border border-[#E4E4E7] bg-white hover:border-zinc-300 transition-all overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedTool(isExpanded ? null : tool.name)}
                    className="p-2.5 flex items-start justify-between cursor-pointer hover:bg-[#F4F4F5]/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-100">
                          {tool.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#71717A] leading-normal">{tool.description}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Schema Expansion View */}
                  {isExpanded && (
                    <div className="border-t border-[#E4E4E7] bg-[#F4F4F5] p-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase">
                          JSON Schema
                        </span>
                        <button
                          onClick={() => copySchemaToClipboard(tool.name, tool.schema)}
                          className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-800 transition-colors"
                        >
                          {copiedSchemaTool === tool.name ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="font-mono text-[10px] bg-zinc-950 text-zinc-200 p-2.5 rounded-md overflow-x-auto leading-relaxed border border-zinc-800">
                        {JSON.stringify(tool.schema, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Logs Section */}
        <div className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#71717A]" />
              <span className="text-[11px] font-semibold text-[#71717A] tracking-wider uppercase">
                Activity
              </span>
            </div>
            {logs.length > 0 && (
              <button
                onClick={clearLogs}
                className="text-[10px] text-[#71717A] hover:text-zinc-900 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#71717A] bg-[#F4F4F5]/50 rounded-lg border border-dashed border-[#E4E4E7]">
              No agent execution logs yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
              {logs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => toggleLogExpanded(log.id)}
                  className="rounded-lg border border-[#E4E4E7] bg-white p-2.5 cursor-pointer hover:border-zinc-300 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      {log.status === 'success' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      <span className="font-mono font-semibold text-[#18181B] text-[11px]">
                        {log.toolName}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#71717A]">{log.timestamp}</span>
                  </div>

                  <p className="text-[11px] text-[#71717A] pl-5 truncate">{log.result}</p>

                  {/* Expanded log details */}
                  {log.expanded && (
                    <div className="mt-2 pl-5 pt-2 border-t border-[#E4E4E7] space-y-1.5 text-[10px] font-mono">
                      <div>
                        <span className="text-zinc-400 font-sans font-medium">Arguments:</span>
                        <pre className="bg-[#F4F4F5] p-1.5 rounded mt-0.5 text-zinc-800 overflow-x-auto">
                          {JSON.stringify(log.args, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-sans font-medium">Result:</span>
                        <p className="text-zinc-700 font-sans bg-[#F4F4F5] p-1.5 rounded mt-0.5">
                          {log.result}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Agent Input Area */}
      <div className="p-3.5 border-t border-[#E4E4E7] bg-white space-y-2.5">
        {/* Quick prompt chips */}
        <div className="space-y-1">
          <span className="text-[10px] font-medium text-[#71717A]">Try prompts:</span>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.slice(0, 2).map((qp, i) => (
              <button
                key={i}
                onClick={() => setPromptInput(qp)}
                className="text-[10px] text-zinc-600 bg-[#F4F4F5] hover:bg-zinc-200/70 border border-[#E4E4E7] rounded px-2 py-0.5 transition-colors truncate max-w-[150px]"
                title={qp}
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {isAgentWorking && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 shrink-0" />
            <span className="truncate">{agentStatusText || 'Agent is working...'}</span>
          </div>
        )}

        {/* Input box */}
        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendPrompt();
              }
            }}
            placeholder="Describe what you'd like to change..."
            rows={2}
            className="w-full text-xs text-[#18181B] placeholder-[#71717A] bg-[#F4F4F5] border border-[#E4E4E7] focus:border-[#6366F1] focus:bg-white rounded-xl p-2.5 pr-9 outline-none resize-none transition-all shadow-inner"
          />

          <button
            onClick={handleSendPrompt}
            disabled={!promptInput.trim() || isAgentWorking}
            className="absolute right-2 bottom-2.5 p-1.5 rounded-lg bg-[#6366F1] hover:bg-indigo-600 text-white disabled:opacity-30 disabled:hover:bg-[#6366F1] transition-colors shadow-sm"
            title="Send to Agent"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
