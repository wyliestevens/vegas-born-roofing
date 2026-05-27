"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

const CATEGORIES = [
  "Residential Roofing",
  "Commercial Roofing",
  "Roof Repair",
  "Maintenance Tips",
  "Industry News",
  "Company Updates",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(slugify(value));
  }

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function addCustomCategory() {
    const trimmed = customCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
      setCustomCategory("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          body,
          featuredImage: featuredImage.trim(),
          categories,
          status,
        }),
      });

      if (res.ok) {
        router.push("/admin/blog");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create post");
      }
    } catch {
      setError("Failed to create post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">New Blog Post</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="auto-generated-from-title"
            />
            <p className="text-xs text-slate-400 mt-1">
              Auto-generated from title. Edit if needed.
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Brief summary of the post"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Write your blog post content here..."
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Featured Image URL
            </label>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Categories
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    categories.includes(cat)
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-slate-600 border-slate-300 hover:border-red-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomCategory();
                  }
                }}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Add custom category"
              />
              <button
                type="button"
                onClick={addCustomCategory}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {categories
                  .filter((c) => !CATEGORIES.includes(c))
                  .map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-100 text-red-700"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className="hover:text-red-900"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "published")
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Creating..." : "Create Post"}
          </button>
          <Link
            href="/admin/blog"
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
