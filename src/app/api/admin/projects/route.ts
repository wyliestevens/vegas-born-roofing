import { NextResponse } from "next/server";
import { getSessionCookie, verifySession } from "@/lib/auth";
import { loadContentRemote, saveContent } from "@/lib/admin-content";

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

    const { data, sha } = await loadContentRemote<Project[]>("projects");
    return NextResponse.json({ projects: data, sha });
  } catch {
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { project, sha } = await request.json();
    if (!project?.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const { data, sha: currentSha } = await loadContentRemote<Project[]>("projects");

    const newProject: Project = {
      id: crypto.randomUUID(),
      title: project.title,
      category: project.category || "Residential",
      description: project.description || "",
      location: project.location || "Las Vegas, NV",
      featured: project.featured || false,
      images: project.images || [],
      createdAt: new Date().toISOString(),
    };

    const updated = [...data, newProject];
    await saveContent("projects", updated, sha || currentSha, `Add project: ${newProject.title}`);

    return NextResponse.json({ project: newProject });
  } catch {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { project, sha } = await request.json();
    if (!project?.id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const { data, sha: currentSha } = await loadContentRemote<Project[]>("projects");

    const updated = data.map((p) =>
      p.id === project.id ? { ...p, ...project } : p
    );

    await saveContent("projects", updated, sha || currentSha, `Update project: ${project.title}`);

    return NextResponse.json({ project });
  } catch {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id, sha } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const { data, sha: currentSha } = await loadContentRemote<Project[]>("projects");

    const project = data.find((p) => p.id === id);
    const updated = data.filter((p) => p.id !== id);

    await saveContent(
      "projects",
      updated,
      sha || currentSha,
      `Delete project: ${project?.title || id}`
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
