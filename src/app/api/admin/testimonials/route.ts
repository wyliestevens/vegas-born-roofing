import { NextResponse } from "next/server";
import { verifySession, getSessionCookie } from "@/lib/auth";
import { loadContentRemote, saveContent } from "@/lib/admin-content";

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

async function authenticate(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionCookie(cookieHeader);
  if (!token) return null;
  return verifySession(token);
}

// GET - list all testimonials
export async function GET(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, sha } = await loadContentRemote<Testimonial[]>("testimonials");
    return NextResponse.json({ testimonials: data, sha });
  } catch {
    return NextResponse.json(
      { error: "Failed to load testimonials" },
      { status: 500 }
    );
  }
}

// POST - create a new testimonial
export async function POST(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { name, quote, rating, source, category, featured, anonymous, sha } = body;

    if (!quote || !source || !category) {
      return NextResponse.json(
        { error: "Quote, source, and category are required" },
        { status: 400 }
      );
    }

    if (!anonymous && !name) {
      return NextResponse.json(
        { error: "Name is required unless anonymous" },
        { status: 400 }
      );
    }

    const { data: existing, sha: currentSha } =
      await loadContentRemote<Testimonial[]>("testimonials");

    const useSha = sha || currentSha;

    const newTestimonial: Testimonial = {
      id: crypto.randomUUID(),
      name: anonymous ? "Anonymous" : name,
      quote,
      rating: Number(rating) || 5,
      source,
      category,
      featured: Boolean(featured),
      anonymous: Boolean(anonymous),
      createdAt: new Date().toISOString(),
    };

    const updated = [...existing, newTestimonial];

    await saveContent("testimonials", updated, useSha, "Add testimonial");

    return NextResponse.json({ testimonial: newTestimonial }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

// PUT - update a testimonial
export async function PUT(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { id, sha, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    const { data: existing, sha: currentSha } =
      await loadContentRemote<Testimonial[]>("testimonials");

    const useSha = sha || currentSha;
    const index = existing.findIndex((t) => t.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    existing[index] = { ...existing[index], ...updates };

    await saveContent("testimonials", existing, useSha, "Update testimonial");

    return NextResponse.json({ testimonial: existing[index] });
  } catch {
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE - remove a testimonial
export async function DELETE(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id, sha } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    const { data: existing, sha: currentSha } =
      await loadContentRemote<Testimonial[]>("testimonials");

    const useSha = sha || currentSha;
    const filtered = existing.filter((t) => t.id !== id);

    if (filtered.length === existing.length) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    await saveContent("testimonials", filtered, useSha, "Delete testimonial");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
