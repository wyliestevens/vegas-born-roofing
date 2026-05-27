"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles, Send, Copy, Check } from "lucide-react";

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

  // AI Suggestions state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    title?: string;
    excerpt?: string;
    body?: string;
    categories?: string[];
  } | null>(null);
  const [aiError, setAiError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

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

  async function handleAiGenerate() {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiResult(null);

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Generate a blog post for Vegas Born Roofing about: ${aiPrompt}

Return your response in this exact format:

TITLE: [blog post title]
EXCERPT: [1-2 sentence summary]
CATEGORIES: [comma-separated categories from: Residential Roofing, Commercial Roofing, Roof Repair, Maintenance Tips, Industry News, Company Updates]
BODY:
[full blog post body in markdown format, 400-800 words, professional but approachable tone, include relevant roofing expertise, Las Vegas context where appropriate]`,
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error("AI request failed");
      }

      const data = await res.json();
      const content = data.content || "";

      // Parse the AI response
      const titleMatch = content.match(/TITLE:\s*(.+)/);
      const excerptMatch = content.match(/EXCERPT:\s*(.+)/);
      const categoriesMatch = content.match(/CATEGORIES:\s*(.+)/);
      const bodyMatch = content.match(/BODY:\s*\n([\s\S]+)/);

      const result = {
        title: titleMatch?.[1]?.trim(),
        excerpt: excerptMatch?.[1]?.trim(),
        body: bodyMatch?.[1]?.trim(),
        categories: categoriesMatch?.[1]
          ?.split(",")
          .map((c: string) => c.trim())
          .filter(Boolean),
      };

      setAiResult(result);

      // Auto-fill form fields
      if (result.title) handleTitleChange(result.title);
      if (result.excerpt) setExcerpt(result.excerpt);
      if (result.body) setBody(result.body);
      if (result.categories) setCategories(result.categories);

      // Auto-fetch a relevant featured image
      try {
        const query = encodeURIComponent(aiPrompt.trim().split(" ").slice(0, 4).join(" ") + " roofing");
        const imgRes = await fetch(`/api/admin/stock-image?q=${query}`);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (imgData.url) {
            setFeaturedImage(imgData.url);
          }
        }
      } catch {
        // Image fetch is optional, don't block on failure
      }
    } catch {
      setAiError("Failed to generate content. Make sure the Anthropic API key is configured.");
    } finally {
      setAiLoading(false);
    }
  }

  function applyAiResult(field: "title" | "excerpt" | "body" | "categories") {
    if (!aiResult) return;
    if (field === "title" && aiResult.title) {
      handleTitleChange(aiResult.title);
    }
    if (field === "excerpt" && aiResult.excerpt) {
      setExcerpt(aiResult.excerpt);
    }
    if (field === "body" && aiResult.body) {
      setBody(aiResult.body);
    }
    if (field === "categories" && aiResult.categories) {
      setCategories(aiResult.categories);
    }
  }

  function applyAll() {
    if (!aiResult) return;
    if (aiResult.title) handleTitleChange(aiResult.title);
    if (aiResult.excerpt) setExcerpt(aiResult.excerpt);
    if (aiResult.body) setBody(aiResult.body);
    if (aiResult.categories) setCategories(aiResult.categories);
  }

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
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

      <div className="flex gap-6">
        {/* Left: Blog Form */}
        <div className="flex-1 min-w-0">
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

        {/* Right: AI Suggestions Panel */}
        <div className="w-80 shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 sticky top-8">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-semibold text-slate-900">AI Suggestions</h3>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-500">
                Describe what you want to write about and AI will generate a complete blog post for you.
              </p>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
                placeholder="e.g. &quot;Tips for maintaining your roof during Las Vegas summers&quot;"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />

              <button
                onClick={handleAiGenerate}
                disabled={aiLoading || !aiPrompt.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Generate Blog Post
                  </>
                )}
              </button>

              {aiError && (
                <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {aiError}
                </div>
              )}
            </div>

            {/* AI Result */}
            {aiResult && (
              <div className="border-t border-slate-200">
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Generated Content
                    </p>
                    <button
                      onClick={applyAll}
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Apply All
                    </button>
                  </div>

                  {aiResult.title && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Title</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(aiResult.title!, "title")}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            title="Copy"
                          >
                            {copied === "title" ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            onClick={() => applyAiResult("title")}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Use
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-800 bg-slate-50 rounded px-2 py-1.5">
                        {aiResult.title}
                      </p>
                    </div>
                  )}

                  {aiResult.excerpt && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Excerpt</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(aiResult.excerpt!, "excerpt")}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            title="Copy"
                          >
                            {copied === "excerpt" ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            onClick={() => applyAiResult("excerpt")}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Use
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 bg-slate-50 rounded px-2 py-1.5">
                        {aiResult.excerpt}
                      </p>
                    </div>
                  )}

                  {aiResult.categories && aiResult.categories.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Categories</span>
                        <button
                          onClick={() => applyAiResult("categories")}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Use
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {aiResult.categories.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiResult.body && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Body</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(aiResult.body!, "body")}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            title="Copy"
                          >
                            {copied === "body" ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            onClick={() => applyAiResult("body")}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Use
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-slate-700 bg-slate-50 rounded px-2 py-1.5 max-h-48 overflow-y-auto whitespace-pre-wrap">
                        {aiResult.body.slice(0, 500)}
                        {aiResult.body.length > 500 && "..."}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
