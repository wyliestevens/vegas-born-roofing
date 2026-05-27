"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const SOURCES = [
  "Google Review",
  "Yelp",
  "Facebook",
  "BBB",
  "Angi",
  "HomeAdvisor",
  "Word of Mouth",
  "Other",
];

const CATEGORIES = [
  "Residential",
  "Commercial",
  "Sheet Metal",
  "Roof Coating",
  "Tile",
  "Repair",
  "General",
];

export default function NewTestimonialPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState("5");
  const [source, setSource] = useState("Google Review");
  const [category, setCategory] = useState("Residential");
  const [featured, setFeatured] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: anonymous ? "Anonymous" : name,
          quote,
          rating: Number(rating),
          source,
          category,
          featured,
          anonymous,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create testimonial");
      }

      router.push("/admin/testimonials");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/testimonials"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Testimonials
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">
          Add Testimonial
        </h2>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
          {/* Anonymous toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-slate-700">Anonymous review</span>
          </label>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Client Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={anonymous}
              required={!anonymous}
              placeholder={anonymous ? "Anonymous" : "Enter client name"}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Quote
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              required
              rows={4}
              placeholder="Enter the testimonial quote..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-y"
            />
          </div>

          {/* Rating & Source row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Star{n !== 1 && "s"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-slate-700">
              Featured testimonial (shown prominently on homepage)
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg
              hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Testimonial"}
          </button>

          <Link
            href="/admin/testimonials"
            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg
              hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
