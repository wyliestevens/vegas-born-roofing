import { NextResponse } from "next/server";
import { getSessionCookie, verifySession } from "@/lib/auth";
import { loadContentRemote, saveContent } from "@/lib/admin-content";

export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

async function authenticate(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionCookie(cookieHeader);
  if (!token) return null;
  return verifySession(token);
}

export async function GET(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, sha } = await loadContentRemote<Service[]>("services");
    return NextResponse.json({ services: data, sha });
  } catch {
    return NextResponse.json({ error: "Failed to load services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { service, sha } = await request.json();
    const { data, sha: currentSha } = await loadContentRemote<Service[]>("services");

    const slug = service.slug || service.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    if (data.some((s) => s.slug === slug)) {
      return NextResponse.json({ error: "A service with this slug already exists" }, { status: 409 });
    }

    const newService: Service = {
      slug,
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
      order: service.order ?? data.length,
    };

    const updated = [...data, newService].sort((a, b) => a.order - b.order);
    await saveContent("services", updated, sha || currentSha, `Add service: ${newService.title}`);

    return NextResponse.json({ service: newService }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { service, sha } = await request.json();
    const { data, sha: currentSha } = await loadContentRemote<Service[]>("services");

    const index = data.findIndex((s) => s.slug === service.slug);
    if (index === -1) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const updatedService: Service = {
      ...data[index],
      ...service,
    };

    const updated = [...data];
    updated[index] = updatedService;
    updated.sort((a, b) => a.order - b.order);

    await saveContent("services", updated, sha || currentSha, `Update service: ${updatedService.title}`);

    return NextResponse.json({ service: updatedService });
  } catch {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { slug, sha } = await request.json();
    const { data, sha: currentSha } = await loadContentRemote<Service[]>("services");

    const service = data.find((s) => s.slug === slug);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const updated = data.filter((s) => s.slug !== slug);
    await saveContent("services", updated, sha || currentSha, `Remove service: ${service.title}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
