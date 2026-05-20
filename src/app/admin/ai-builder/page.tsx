'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const pages = [
  { value: 'home', label: 'Home Page' },
  { value: 'meet-the-team', label: 'Meet the Team' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'free-quote', label: 'Free Quote' },
  { value: 'contact', label: 'Contact' },
  { value: 'employment', label: 'Employment' },
  { value: 'general', label: 'General / New Content' },
];

interface HistoryItem {
  prompt: string;
  page: string;
  result: string;
  timestamp: string;
}

export default function AIBuilder() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [page, setPage] = useState('home');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/ai-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, page }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate content');
        setLoading(false);
        return;
      }

      setResult(data.result);
      setHistory((prev) => [
        {
          prompt,
          page,
          result: data.result,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Header */}
      <div className="bg-[#1f2937] border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/images/logo.png" alt="Vegas Born Roofing" width={50} height={58} />
            <div>
              <h1 className="text-white font-bold text-lg">AI Content Builder</h1>
              <p className="text-gray-400 text-sm">Powered by Claude Sonnet</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input panel */}
          <div>
            <form onSubmit={handleGenerate} className="bg-[#1f2937] rounded-xl p-6 border border-gray-700">
              <h2 className="text-white font-bold text-lg mb-4">Generate Content</h2>

              <div className="mb-4">
                <label htmlFor="page" className="block text-sm font-semibold text-gray-300 mb-1">
                  Target Page
                </label>
                <select
                  id="page"
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition"
                >
                  {pages.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-semibold text-gray-300 mb-1">
                  What do you want to create or change?
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#111827] border border-gray-600 text-white focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent outline-none transition resize-vertical"
                  placeholder="e.g., Create a new testimonial section with 3 customer reviews..."
                />
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#b91c1c] text-white py-3 rounded-lg font-bold hover:bg-[#991b1b] transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Content'}
              </button>
            </form>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6 bg-[#1f2937] rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-bold mb-4">Request History</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {history.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setResult(item.result);
                        setPage(item.page);
                        setPrompt(item.prompt);
                      }}
                      className="w-full text-left bg-[#111827] rounded-lg p-3 hover:border-[#b91c1c] border border-gray-600 transition-colors"
                    >
                      <p className="text-white text-sm truncate">{item.prompt}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {item.page} &middot; {item.timestamp}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Output panel */}
          <div>
            <div className="bg-[#1f2937] rounded-xl border border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-400 text-sm ml-2">Generated Code</span>
                </div>
                {result && (
                  <button
                    onClick={copyToClipboard}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="p-4 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center gap-3 text-gray-400">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating with Claude Sonnet...
                  </div>
                ) : result ? (
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-words">
                    {result}
                  </pre>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Generated code will appear here. Select a page, describe what you want, and click
                    Generate.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
