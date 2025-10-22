"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { parseClaudeExport, ParsedExport } from "@/lib/parser";
import { ConversationView } from "@/components/ConversationView";
import { SignInButton, SignOutButton } from "@/components/AuthButton";

export default function Home() {
  const { data: session } = useSession();
  const [parsedData, setParsedData] = useState<ParsedExport | null>(null);
  const [originalText, setOriginalText] = useState<string>("");
  const [inputMethod, setInputMethod] = useState<'paste' | 'upload'>('paste');
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load from database on mount
  useEffect(() => {
    const loadFromDatabase = async () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
          setLoading(true);
          try {
            const response = await fetch(`/api/exports/${id}`);
            if (response.ok) {
              const data = await response.json();
              const parsed = parseClaudeExport(data.content);
              setParsedData(parsed);
              setOriginalText(data.content);
            } else {
              alert("Export not found or expired");
            }
          } catch (error) {
            console.error("Failed to load from database:", error);
            alert("Failed to load export");
          } finally {
            setLoading(false);
          }
        }
      }
    };
    loadFromDatabase();
  }, []);

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.trim()) {
      try {
        const parsed = parseClaudeExport(text);
        setParsedData(parsed);
        setOriginalText(text);
        setShareUrl("");
      } catch (error) {
        console.error("Parse error:", error);
        alert("Failed to parse export. Please check the format.");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        try {
          const parsed = parseClaudeExport(text);
          setParsedData(parsed);
          setOriginalText(text);
          setShareUrl("");
        } catch (error) {
          console.error("Parse error:", error);
          alert("Failed to parse export. Please check the format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    setParsedData(null);
    setOriginalText("");
    setShareUrl("");
    setCopied(false);
    // Clear URL params
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const handleShare = async () => {
    if (originalText) {
      setLoading(true);
      try {
        const response = await fetch('/api/exports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: originalText }),
        });

        if (response.ok) {
          const data = await response.json();
          const url = `${window.location.origin}?id=${data.id}`;
          setShareUrl(url);
        } else {
          alert("Failed to save export");
        }
      } catch (error) {
        console.error("Failed to save:", error);
        alert("Failed to save export");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopyUrl = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
  };

  if (parsedData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b shadow-sm z-10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Viewing Export
            </h2>
            <div className="flex gap-2 items-center">
              {session && (
                <span className="text-sm text-gray-600 mr-2">
                  {session.user?.email}
                </span>
              )}
              {!shareUrl ? (
                <button
                  onClick={handleShare}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-[#C15F3C] hover:bg-[#A14F30] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "🔗 Share"}
                </button>
              ) : (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono text-gray-600 w-64"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className={`px-4 py-2 text-sm rounded-lg transition ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              )}
              {session && (
                <button
                  onClick={() => window.location.href = '/my-exports'}
                  className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  My Exports
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                ← Back
              </button>
              {session ? <SignOutButton /> : <SignInButton />}
            </div>
          </div>
        </div>
        <ConversationView data={parsedData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="absolute top-4 right-4">
          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{session.user?.email}</span>
              <button
                onClick={() => window.location.href = '/my-exports'}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                My Exports
              </button>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="40" height="40" rx="8" fill="#C15F3C"/>
              <path d="M30 35 L40 45 L50 35" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Claude Code Export Viewer
          </h1>
          <p className="text-gray-700 text-lg mb-1">
            Share beautiful Claude Code conversations
          </p>
          <p className="text-gray-600 text-sm">
            Upload or paste your export to create a shareable link
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Input method selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setInputMethod('paste')}
              className={`flex-1 py-3 rounded-lg font-medium transition ${
                inputMethod === 'paste'
                  ? 'bg-[#C15F3C] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setInputMethod('upload')}
              className={`flex-1 py-3 rounded-lg font-medium transition ${
                inputMethod === 'upload'
                  ? 'bg-[#C15F3C] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Upload File
            </button>
          </div>

          {inputMethod === 'paste' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste your export:
              </label>
              <textarea
                className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[#C15F3C] focus:border-transparent resize-none"
                placeholder="Paste your Claude Code export here..."
                onChange={handlePaste}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a file:
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#C15F3C] transition">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    .txt files only
                  </p>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            🔒 Parsing happens in your browser. Exports are saved only when you click Share.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <a
              href="https://github.com/AlexisLaporte/claude-export-vizualize"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C15F3C] transition flex items-center gap-1"
            >
              ⭐ Star on GitHub
            </a>
            <span>•</span>
            <a
              href="https://github.com/AlexisLaporte/claude-export-vizualize/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C15F3C] transition"
            >
              Report Issue
            </a>
            <span>•</span>
            <span>Open Source (MIT)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
