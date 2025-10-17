"use client";

import { ParsedExport, ClaudeMessage } from "@/lib/parser";

interface ConversationViewProps {
  data: ParsedExport;
}

// Helper to render tool result content with syntax highlighting for diffs
function renderToolResult(content: string) {
  const lines = content.split('\n');

  return lines.map((line, i) => {
    const trimmed = line.trim();

    // Detect diff lines
    if (trimmed.match(/^\d+\s+[+-]/)) {
      const isDeletion = trimmed.includes('-');
      const isAddition = trimmed.includes('+');

      return (
        <div
          key={i}
          className={`${
            isDeletion
              ? 'bg-red-50 text-red-800'
              : isAddition
              ? 'bg-green-50 text-green-800'
              : ''
          }`}
        >
          {line}
        </div>
      );
    }

    return <div key={i}>{line}</div>;
  });
}

export function ConversationView({ data }: ConversationViewProps) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-lg p-6 mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-2xl font-mono">
            <pre className="text-xs leading-tight">
{`▐▛███▜▌
▝▜█████▛▘
  ▘▘ ▝▝`}
            </pre>
          </div>
          <div>
            <h1 className="text-xl font-bold">Claude Code {data.header.version}</h1>
            <p className="text-purple-200">{data.header.model}</p>
          </div>
        </div>
        <p className="text-sm text-purple-300 font-mono">{data.header.directory}</p>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {data.messages.map((msg, idx) => {
          if (msg.type === 'user') {
            return (
              <div key={idx} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  👤
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-500 mb-1">You</div>
                  <div className="bg-blue-50 rounded-2xl rounded-tl-sm p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-900 whitespace-pre-wrap font-medium">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === 'assistant') {
            return (
              <div key={idx} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-md text-xl">
                  🤖
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-purple-600 mb-1">Claude Code</div>
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 border border-purple-200 shadow-sm">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === 'tool-call') {
            return (
              <div key={idx} className="ml-14 mb-2">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-lg p-3 inline-block shadow-sm">
                  <div className="font-mono text-sm flex items-center gap-1">
                    <span className="text-amber-600">⚙️</span>
                    <span className="text-amber-800 font-bold">{msg.toolName}</span>
                    <span className="text-gray-500">(</span>
                    <span className="text-blue-700 font-semibold">{msg.toolArgs}</span>
                    <span className="text-gray-500">)</span>
                    {msg.content && <span className="text-gray-600 ml-2 italic">{msg.content}</span>}
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === 'tool-result') {
            // Check if it's a diff/update output
            const isDiff = msg.content.includes('additions and') || msg.content.match(/^\s*\d+\s+[+-]/m);

            return (
              <div key={idx} className="ml-14 mb-3">
                <div className={`${isDiff ? 'bg-slate-50 border-slate-300' : 'bg-gray-50 border-gray-300'} border rounded-lg p-3 shadow-sm`}>
                  <div className="text-xs text-gray-500 mb-2 font-semibold">↳ Output</div>
                  <pre className="text-xs text-gray-700 font-mono overflow-x-auto">
                    {isDiff ? renderToolResult(msg.content) : msg.content}
                  </pre>
                  {msg.hasMore && (
                    <div className="mt-2 text-xs text-gray-500 italic">
                      ... +{msg.moreLines} lines (collapsed)
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
