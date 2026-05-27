import { NextResponse } from "next/server";
import { getSessionCookie, verifySession } from "@/lib/auth";
import { loadContentRemote, saveContent } from "@/lib/admin-content";

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

async function authenticate(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionCookie(cookieHeader);
  if (!token) return null;
  return verifySession(token);
}

/* ------------------------------------------------------------------ */
/*  GET — list all posts                                               */
/* ------------------------------------------------------------------ */

export async function GET(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, sha } = await loadContentRemote<BlogPost[]>("blog-posts");
    return NextResponse.json({ posts: data, sha });
  } catch (err) {
    console.error("[blog] GET error:", err);
    return NextResponse.json(
      { error: "Failed to load blog posts" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST — create a new post                                           */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, featuredImage, categories, status } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const { data: posts, sha } = await loadContentRemote<BlogPost[]>("blog-posts");

    if (posts.some((p) => p.slug === slug)) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const newPost: BlogPost = {
      title,
      slug,
      excerpt: excerpt || "",
      body: body.body || "",
      featuredImage: featuredImage || "",
      categories: categories || [],
      status: status || "draft",
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newPost, ...posts];
    await saveContent("blog-posts", updated, sha, `Add blog post: ${title}`);

    return NextResponse.json({ ok: true, post: newPost });
  } catch (err) {
    console.error("[blog] POST error:", err);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  PUT — update a post by slug                                        */
/* ------------------------------------------------------------------ */

export async function PUT(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, excerpt, featuredImage, categories, status } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const { data: posts, sha } = await loadContentRemote<BlogPost[]>("blog-posts");
    const index = posts.findIndex((p) => p.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const updatedPost: BlogPost = {
      ...posts[index],
      title: title ?? posts[index].title,
      excerpt: excerpt ?? posts[index].excerpt,
      body: body.body ?? posts[index].body,
      featuredImage: featuredImage ?? posts[index].featuredImage,
      categories: categories ?? posts[index].categories,
      status: status ?? posts[index].status,
      updatedAt: now,
    };

    const updated = [...posts];
    updated[index] = updatedPost;

    await saveContent("blog-posts", updated, sha, `Update blog post: ${updatedPost.title}`);

    return NextResponse.json({ ok: true, post: updatedPost });
  } catch (err) {
    console.error("[blog] PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  DELETE — delete a post by slug                                     */
/* ------------------------------------------------------------------ */

export async function DELETE(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const { data: posts, sha } = await loadContentRemote<BlogPost[]>("blog-posts");
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const updated = posts.filter((p) => p.slug !== slug);
    await saveContent("blog-posts", updated, sha, `Delete blog post: ${post.title}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[blog] DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
