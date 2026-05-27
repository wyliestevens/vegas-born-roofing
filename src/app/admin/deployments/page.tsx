"use client";

import { useEffect, useState } from "react";
import {
  Rocket,
  RefreshCw,
  RotateCcw,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

interface Deployment {
  id: string;
  url: string;
  state: string;
  created: string;
  commitMessage: string;
  target: string | null;
}

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadDeployments();
  }, []);

  async function loadDeployments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/deployments");
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to load deployments");
        return;
      }
      const data = await res.json();
      setDeployments(data.deployments || []);
    } catch {
      setError("Failed to connect to deployments API");
    } finally {
      setLoading(false);
    }
  }

  async function handleRedeploy() {
    if (!confirm("Trigger a new production deployment?")) return;
    setActionLoading("redeploy");
    try {
      const res = await fetch("/api/admin/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "redeploy" }),
      });
      if (res.ok) {
        await loadDeployments();
      } else {
        const data = await res.json();
        alert(data.error || "Redeploy failed");
      }
    } catch {
      alert("Redeploy request failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function handlePromote(deploymentId: string) {
    if (!confirm("Promote this deployment to production?")) return;
    setActionLoading(deploymentId);
    try {
      const res = await fetch("/api/admin/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rollback", deploymentId }),
      });
      if (res.ok) {
        await loadDeployments();
      } else {
        const data = await res.json();
        alert(data.error || "Promote failed");
      }
    } catch {
      alert("Promote request failed");
    } finally {
      setActionLoading(null);
    }
  }

  function statusIcon(state: string) {
    switch (state) {
      case "READY":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "ERROR":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "BUILDING":
        return <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />;
      case "QUEUED":
        return <Clock className="h-5 w-5 text-slate-400" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Deployments Unavailable
        </h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <p className="text-sm text-slate-500">
          Make sure <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">VERCEL_TOKEN</code> and{" "}
          <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">VERCEL_PROJECT_ID</code> environment
          variables are set.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Deployments</h2>
          <p className="text-sm text-slate-500 mt-1">
            Vercel deployment history and controls
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadDeployments}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={handleRedeploy}
            disabled={actionLoading === "redeploy"}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {actionLoading === "redeploy" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            Redeploy
          </button>
        </div>
      </div>

      {deployments.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No deployments found.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-slate-200">
            {deployments.map((dep) => (
              <div
                key={dep.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50"
              >
                <div className="flex-shrink-0">{statusIcon(dep.state)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {dep.commitMessage || "No commit message"}
                    </p>
                    {dep.target === "production" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                        Production
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <a
                      href={`https://${dep.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 truncate"
                    >
                      {dep.url}
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                    <span className="text-xs text-slate-400">
                      {new Date(dep.created).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                {dep.state === "READY" && dep.target !== "production" && (
                  <button
                    onClick={() => handlePromote(dep.id)}
                    disabled={actionLoading === dep.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    {actionLoading === dep.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5" />
                    )}
                    Promote
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
