"use client";

import { ParsedExport } from "@/lib/parser";

interface ConversationViewProps {
  data: ParsedExport;
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
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          }

          if (msg.type === 'assistant') {
            return (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div className="flex-1 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          }

          if (msg.type === 'tool-call') {
            return (
              <div key={idx} className="ml-11 mb-1">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 inline-block">
                  <div className="font-mono text-sm">
                    <span className="text-amber-700 font-semibold">{msg.toolName}</span>
                    <span className="text-gray-600">(</span>
                    <span className="text-blue-600">{msg.toolArgs}</span>
                    <span className="text-gray-600">)</span>
                    {msg.content && <span className="text-gray-500 ml-2">{msg.content}</span>}
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === 'tool-result') {
            return (
              <div key={idx} className="ml-11">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto">
                    {msg.content}
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
