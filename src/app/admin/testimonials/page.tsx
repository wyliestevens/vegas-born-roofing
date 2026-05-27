"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Trash2,
  Plus,
  Loader2,
  MessageSquareQuote,
  BadgeCheck,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  source: string;
  category: string;
  featured: boolean;
  anonymous: boolean;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [sha, setSha] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function loadTestimonials() {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
      setSha(data.sha || "");
    } catch {
      setError("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, sha }),
      });
      if (!res.ok) throw new Error("Delete failed");
      await loadTestimonials();
    } catch {
      setError("Failed to delete testimonial");
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleFeatured(t: Testimonial) {
    setToggling(t.id);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: t.id, featured: !t.featured, sha }),
      });
      if (!res.ok) throw new Error("Update failed");
      await loadTestimonials();
    } catch {
      setError("Failed to update testimonial");
    } finally {
      setToggling(null);
    }
  }

  function renderStars(rating: number) {
    return (
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            }`}
          />
        ))}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Testimonials</h2>
          <p className="text-sm text-slate-500 mt-1">
            {testimonials.length} testimonial{testimonials.length !== 1 && "s"}
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Link>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 underline hover:no-underline"
          >
            dismiss
          </button>
        </div>
      )}

      {testimonials.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
          <MessageSquareQuote className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 mb-4">No testimonials yet</p>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Testimonial
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {t.anonymous ? (
                      <span className="italic text-slate-400">Anonymous</span>
                    ) : (
                      t.name
                    )}
                  </h3>
                  {t.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                      <BadgeCheck className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  {renderStars(t.rating)}
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                    {t.source}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                    {t.category}
                  </span>
                  <span>
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleFeatured(t)}
                  disabled={toggling === t.id}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    t.featured
                      ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  } disabled:opacity-50`}
                >
                  {toggling === t.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : t.featured ? (
                    "Unfeature"
                  ) : (
                    "Feature"
                  )}
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deleting === t.id}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting === t.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
