"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Star, Loader2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  featured: boolean;
  images: string[];
  createdAt?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data.projects || []);
      setSha(data.sha || "");
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      setDeleting(id);
      const res = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, sha }),
      });

      if (!res.ok) throw new Error("Failed to delete project");
      await loadProjects();
    } catch {
      setError("Failed to delete project");
    } finally {
      setDeleting(null);
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
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage your portfolio projects.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Project
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {project.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {project.location}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {project.featured && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting === project.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      {deleting === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
