"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  categories: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch("/api/admin/blog");
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        const post = (data.posts as BlogPost[]).find(
          (p: BlogPost) => p.slug === slug
        );
        if (!post) {
          setNotFound(true);
          return;
        }
        setTitle(post.title);
        setExcerpt(post.excerpt || "");
        setBody(post.body || "");
        setFeaturedImage(post.featuredImage || "");
        setCategories(post.categories || []);
        setStatus(post.status || "draft");
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

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
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: title.trim(),
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
        setError(data.error || "Failed to update post");
      }
    } catch {
      setError("Failed to update post");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-3xl">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-500">Post not found.</p>
        </div>
      </div>
    );
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

      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Edit Blog Post
      </h2>

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
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Slug (read-only) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              disabled
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">
              Slug cannot be changed after creation.
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
            {saving ? "Saving..." : "Save Changes"}
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
