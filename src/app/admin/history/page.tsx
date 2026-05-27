"use client";

import { useEffect, useState } from "react";
import { History, RotateCcw, Loader2, GitCommit } from "lucide-react";

interface Commit {
  sha: string;
  message: string;
  date: string;
  author: string;
}

export default function HistoryPage() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [confirmSha, setConfirmSha] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/history");
      if (res.ok) {
        const data = await res.json();
        setCommits(data.commits || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  }

  function isRestorable(message: string): boolean {
    return message.startsWith("admin:") || message.includes("data/");
  }

  async function handleRestore(sha: string) {
    if (confirmSha !== sha) {
      setConfirmSha(sha);
      return;
    }

    setRestoring(sha);
    setConfirmSha(null);
    try {
      const commit = commits.find((c) => c.sha === sha);
      // Extract data file path from commit message
      const pathMatch = commit?.message.match(/data\/[\w/.-]+/);
      const path = pathMatch ? pathMatch[0] : null;

      if (!path) {
        alert("Could not determine file path from commit message");
        return;
      }

      const res = await fetch("/api/admin/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, commitSha: sha }),
      });

      if (res.ok) {
        alert("File restored successfully");
        await loadHistory();
      } else {
        const data = await res.json();
        alert(data.error || "Restore failed");
      }
    } catch {
      alert("Restore request failed");
    } finally {
      setRestoring(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Git History</h2>
          <p className="text-sm text-slate-500 mt-1">
            Recent commits and data restore
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <History className="h-4 w-4" />
          {commits.length} commits
        </div>
      </div>

      {commits.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No commit history found.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-slate-200">
            {commits.map((commit) => (
              <div
                key={commit.sha}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50"
              >
                <div className="flex-shrink-0">
                  <GitCommit className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {commit.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <code className="text-xs text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                      {commit.sha.slice(0, 7)}
                    </code>
                    <span className="text-xs text-slate-400">
                      {new Date(commit.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-xs text-slate-400">
                      {commit.author}
                    </span>
                  </div>
                </div>
                {isRestorable(commit.message) && (
                  <button
                    onClick={() => handleRestore(commit.sha)}
                    disabled={restoring === commit.sha}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg disabled:opacity-50 ${
                      confirmSha === commit.sha
                        ? "text-white bg-red-600 hover:bg-red-700"
                        : "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {restoring === commit.sha ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5" />
                    )}
                    {confirmSha === commit.sha ? "Confirm?" : "Restore"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
