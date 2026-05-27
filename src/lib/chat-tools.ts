/**
 * AI Chat tool definitions and executors for Claude.
 * Tools let the AI assistant manage all website content.
 */

import { loadContentRemote, saveContent, type ContentFile } from "./admin-content";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToolSchema {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToolExecutor = (input: Record<string, any>) => Promise<unknown>;

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

export const SYSTEM_PROMPT = `You are the AI assistant for the Vegas Born Roofing admin dashboard. You help staff manage the website.

Company context: Vegas Born Roofing LLC is a Las Vegas-based roofing company founded in 2018 by Jodd Friesz. Licensed in Nevada (#0084099), Utah (#12307984-5501), and Arizona (#350069). Services include residential roofing, commercial roofing, sheet metal, tile, roof coatings, and repairs. Phone: (702) 876-2630. Located at 4205 W Tompkins Ave, Suite 6, Las Vegas, NV 89103. Hours: Mon-Fri 7:30 AM - 4:00 PM.

You can create/edit/delete blog posts, testimonials, projects, team bios, services, and site settings via tools.

Rules:
- Blog posts default to "draft" status. Tell the user to publish manually or ask you to publish.
- Every save triggers a Vercel rebuild (~60 seconds).
- Never fabricate project details or customer reviews.
- Be concise and professional.`;

// ---------------------------------------------------------------------------
// Tool schemas (Anthropic tool format)
// ---------------------------------------------------------------------------

export const toolSchemas: ToolSchema[] = [
  // Testimonials
  {
    name: "list_testimonials",
    description: "List all testimonials on the website.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "create_testimonial",
    description: "Create a new testimonial.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Client name" },
        quote: { type: "string", description: "Testimonial text" },
        rating: { type: "number", description: "Rating 1-5" },
        source: { type: "string", description: "e.g. Google Review, Yelp" },
        category: { type: "string", description: "Service category" },
        featured: { type: "boolean", description: "Show on homepage" },
        anonymous: { type: "boolean", description: "Is the client anonymous" },
      },
      required: ["name", "quote", "rating"],
    },
  },
  {
    name: "update_testimonial",
    description: "Update an existing testimonial by ID.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Testimonial ID" },
        name: { type: "string" },
        quote: { type: "string" },
        rating: { type: "number" },
        source: { type: "string" },
        category: { type: "string" },
        featured: { type: "boolean" },
        anonymous: { type: "boolean" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_testimonial",
    description: "Delete a testimonial by ID.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string", description: "Testimonial ID" } },
      required: ["id"],
    },
  },

  // Projects
  {
    name: "list_projects",
    description: "List all roofing projects on the website.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "create_project",
    description: "Create a new roofing project.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Project title" },
        category: { type: "string", description: "e.g. Residential, Commercial, Tile, Metal" },
        description: { type: "string", description: "Project description" },
        location: { type: "string", description: "Project location" },
        featured: { type: "boolean", description: "Show on homepage" },
        images: { type: "array", items: { type: "string" }, description: "Image paths" },
      },
      required: ["title", "category", "description"],
    },
  },
  {
    name: "update_project",
    description: "Update an existing project by ID.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Project ID" },
        title: { type: "string" },
        category: { type: "string" },
        description: { type: "string" },
        location: { type: "string" },
        featured: { type: "boolean" },
        images: { type: "array", items: { type: "string" } },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_project",
    description: "Delete a project by ID.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string", description: "Project ID" } },
      required: ["id"],
    },
  },

  // Team members
  {
    name: "list_team_members",
    description: "List all team members.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "update_team_member",
    description: "Update a team member by ID.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Team member ID" },
        name: { type: "string" },
        title: { type: "string" },
        bio: { type: "array", items: { type: "string" }, description: "Array of bio paragraphs" },
        order: { type: "number" },
      },
      required: ["id"],
    },
  },

  // Services
  {
    name: "list_services",
    description: "List all roofing services.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "update_service",
    description: "Update a service by slug.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Service slug" },
        title: { type: "string" },
        description: { type: "string" },
        icon: { type: "string" },
      },
      required: ["slug"],
    },
  },

  // Site settings
  {
    name: "get_site_settings",
    description: "Get current site settings (phone, email, address, social links, etc.).",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "update_site_settings",
    description: "Update site settings. Pass only the fields you want to change.",
    input_schema: {
      type: "object",
      properties: {
        phone: { type: "string" },
        email: { type: "string" },
        address: { type: "string" },
        tagline: { type: "string" },
        socialLinks: {
          type: "object",
          properties: {
            facebook: { type: "string" },
            instagram: { type: "string" },
            yelp: { type: "string" },
            google: { type: "string" },
          },
        },
      },
    },
  },

  // Blog posts
  {
    name: "list_blog_posts",
    description: "List all blog posts with their title, slug, status, and date.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "create_blog_post",
    description: "Create a new blog post. Defaults to draft status.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Blog post title" },
        slug: { type: "string", description: "URL slug (auto-generated from title if omitted)" },
        excerpt: { type: "string", description: "Short excerpt/summary" },
        body: { type: "string", description: "Full post body in Markdown" },
        categories: { type: "array", items: { type: "string" } },
        status: { type: "string", enum: ["draft", "published"], description: "Default: draft" },
        author: { type: "string", description: "Author name" },
        featuredImage: { type: "string", description: "Image path" },
      },
      required: ["title", "body"],
    },
  },
  {
    name: "update_blog_post",
    description: "Update a blog post by slug.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Blog post slug to update" },
        title: { type: "string" },
        excerpt: { type: "string" },
        body: { type: "string" },
        categories: { type: "array", items: { type: "string" } },
        status: { type: "string", enum: ["draft", "published"] },
        author: { type: "string" },
        featuredImage: { type: "string" },
      },
      required: ["slug"],
    },
  },
  {
    name: "delete_blog_post",
    description: "Delete a blog post by slug.",
    input_schema: {
      type: "object",
      properties: { slug: { type: "string", description: "Blog post slug" } },
      required: ["slug"],
    },
  },

  // Images
  {
    name: "list_images",
    description: "List all uploaded images in the media library.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "delete_image",
    description: "Delete an uploaded image by path.",
    input_schema: {
      type: "object",
      properties: { path: { type: "string", description: "Image path e.g. public/uploads/blog/photo.jpg" } },
      required: ["path"],
    },
  },
];

// ---------------------------------------------------------------------------
// Helper: slugify
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadArray(file: ContentFile): Promise<{ data: any[]; sha: string }> {
  return loadContentRemote<unknown[]>(file);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadObject(file: ContentFile): Promise<{ data: any; sha: string }> {
  return loadContentRemote<unknown>(file);
}

// ---------------------------------------------------------------------------
// Tool executors
// ---------------------------------------------------------------------------

export const toolExecutors: Record<string, ToolExecutor> = {
  // --- Testimonials ---
  async list_testimonials() {
    const { data } = await loadArray("testimonials");
    return data.map((t: { id: string; name: string; category: string; featured: boolean; rating: number }) => ({
      id: t.id, name: t.name, category: t.category, featured: t.featured, rating: t.rating,
    }));
  },

  async create_testimonial(input) {
    const { data, sha } = await loadArray("testimonials");
    const id = slugify(input.name || "testimonial") + "-" + Date.now();
    const now = new Date().toISOString();
    const entry = {
      id,
      name: input.name,
      quote: input.quote,
      rating: input.rating ?? 5,
      source: input.source ?? "Google Review",
      category: input.category ?? "Roofing",
      featured: input.featured ?? false,
      anonymous: input.anonymous ?? false,
      order: data.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    data.push(entry);
    await saveContent("testimonials", data, sha, `admin: create testimonial "${input.name}"`);
    return { created: entry };
  },

  async update_testimonial(input) {
    const { data, sha } = await loadArray("testimonials");
    const idx = data.findIndex((t: { id: string }) => t.id === input.id);
    if (idx === -1) return { error: `Testimonial "${input.id}" not found` };
    const { id: _id, ...updates } = input;
    Object.assign(data[idx], updates, { updatedAt: new Date().toISOString() });
    await saveContent("testimonials", data, sha, `admin: update testimonial "${input.id}"`);
    return { updated: data[idx] };
  },

  async delete_testimonial(input) {
    const { data, sha } = await loadArray("testimonials");
    const idx = data.findIndex((t: { id: string }) => t.id === input.id);
    if (idx === -1) return { error: `Testimonial "${input.id}" not found` };
    data.splice(idx, 1);
    await saveContent("testimonials", data, sha, `admin: delete testimonial "${input.id}"`);
    return { deleted: input.id };
  },

  // --- Projects ---
  async list_projects() {
    const { data } = await loadArray("projects");
    return data;
  },

  async create_project(input) {
    const { data, sha } = await loadArray("projects");
    const id = "project-" + String(data.length + 1).padStart(3, "0") + "-" + Date.now();
    const entry = {
      id,
      title: input.title,
      category: input.category,
      description: input.description,
      location: input.location ?? "Las Vegas, NV",
      featured: input.featured ?? false,
      images: input.images ?? [],
    };
    data.push(entry);
    await saveContent("projects", data, sha, `admin: create project "${input.title}"`);
    return { created: entry };
  },

  async update_project(input) {
    const { data, sha } = await loadArray("projects");
    const idx = data.findIndex((r: { id: string }) => r.id === input.id);
    if (idx === -1) return { error: `Project "${input.id}" not found` };
    const { id: _id, ...updates } = input;
    Object.assign(data[idx], updates);
    await saveContent("projects", data, sha, `admin: update project "${input.id}"`);
    return { updated: data[idx] };
  },

  async delete_project(input) {
    const { data, sha } = await loadArray("projects");
    const idx = data.findIndex((r: { id: string }) => r.id === input.id);
    if (idx === -1) return { error: `Project "${input.id}" not found` };
    data.splice(idx, 1);
    await saveContent("projects", data, sha, `admin: delete project "${input.id}"`);
    return { deleted: input.id };
  },

  // --- Team Members ---
  async list_team_members() {
    const { data } = await loadArray("team");
    return data.map((m: { id: string; name: string; title: string; order: number }) => ({
      id: m.id, name: m.name, title: m.title, order: m.order,
    }));
  },

  async update_team_member(input) {
    const { data, sha } = await loadArray("team");
    const idx = data.findIndex((m: { id: string }) => m.id === input.id);
    if (idx === -1) return { error: `Team member "${input.id}" not found` };
    const { id: _id, ...updates } = input;
    Object.assign(data[idx], updates);
    await saveContent("team", data, sha, `admin: update team member "${input.id}"`);
    return { updated: data[idx] };
  },

  // --- Services ---
  async list_services() {
    try {
      const { data } = await loadArray("services");
      return data;
    } catch {
      return { error: "Services file not found. It may need to be created." };
    }
  },

  async update_service(input) {
    try {
      const { data, sha } = await loadArray("services");
      const idx = data.findIndex((p: { slug: string }) => p.slug === input.slug);
      if (idx === -1) return { error: `Service "${input.slug}" not found` };
      const { slug: _slug, ...updates } = input;
      Object.assign(data[idx], updates);
      await saveContent("services", data, sha, `admin: update service "${input.slug}"`);
      return { updated: data[idx] };
    } catch {
      return { error: "Services file not found." };
    }
  },

  // --- Site Settings ---
  async get_site_settings() {
    try {
      const { data } = await loadObject("site-settings");
      return data;
    } catch {
      return { error: "Site settings file not found." };
    }
  },

  async update_site_settings(input) {
    try {
      const { data, sha } = await loadObject("site-settings");
      Object.assign(data, input);
      await saveContent("site-settings", data, sha, "admin: update site settings");
      return { updated: data };
    } catch {
      return { error: "Site settings file not found." };
    }
  },

  // --- Blog Posts ---
  async list_blog_posts() {
    const { data } = await loadArray("blog-posts");
    return data.map((p: { slug: string; title: string; status: string; createdAt: string; author: string }) => ({
      slug: p.slug, title: p.title, status: p.status, createdAt: p.createdAt, author: p.author,
    }));
  },

  async create_blog_post(input) {
    const { data, sha } = await loadArray("blog-posts");
    const now = new Date().toISOString();
    const slug = input.slug || slugify(input.title);

    if (data.some((p: { slug: string }) => p.slug === slug)) {
      return { error: `Blog post with slug "${slug}" already exists` };
    }

    const entry = {
      slug,
      title: input.title,
      excerpt: input.excerpt ?? "",
      body: input.body,
      featuredImage: input.featuredImage ?? "",
      categories: input.categories ?? [],
      status: input.status ?? "draft",
      author: input.author ?? "Vegas Born Roofing",
      createdAt: now,
      updatedAt: now,
    };
    data.push(entry);
    await saveContent("blog-posts", data, sha, `admin: create blog post "${input.title}"`);
    return { created: { slug: entry.slug, title: entry.title, status: entry.status } };
  },

  async update_blog_post(input) {
    const { data, sha } = await loadArray("blog-posts");
    const idx = data.findIndex((p: { slug: string }) => p.slug === input.slug);
    if (idx === -1) return { error: `Blog post "${input.slug}" not found` };
    const { slug: _slug, ...updates } = input;
    Object.assign(data[idx], updates, { updatedAt: new Date().toISOString() });
    await saveContent("blog-posts", data, sha, `admin: update blog post "${input.slug}"`);
    return { updated: { slug: data[idx].slug, title: data[idx].title, status: data[idx].status } };
  },

  async delete_blog_post(input) {
    const { data, sha } = await loadArray("blog-posts");
    const idx = data.findIndex((p: { slug: string }) => p.slug === input.slug);
    if (idx === -1) return { error: `Blog post "${input.slug}" not found` };
    data.splice(idx, 1);
    await saveContent("blog-posts", data, sha, `admin: delete blog post "${input.slug}"`);
    return { deleted: input.slug };
  },

  // --- Images ---
  async list_images() {
    const { listUploads } = await import("./github");
    const images = await listUploads();
    return images.map((img) => ({ path: img.path, name: img.name, url: img.url, size: img.size }));
  },

  async delete_image(input) {
    const { readFile, deleteFile } = await import("./github");
    const { sha } = await readFile(input.path);
    await deleteFile(input.path, sha, `admin: delete image "${input.path}"`);
    return { deleted: input.path };
  },
};
