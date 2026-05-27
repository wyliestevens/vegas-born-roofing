import { NextResponse } from "next/server";
import { getSessionCookie, verifySession } from "@/lib/auth";
import { loadContentRemote, saveContent } from "@/lib/admin-content";

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  photo: string;
  bio: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
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

    const { data, sha } = await loadContentRemote<TeamMember[]>("team");
    return NextResponse.json({ team: data, sha });
  } catch {
    return NextResponse.json({ error: "Failed to load team" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { member, sha } = await request.json();
    const { data, sha: currentSha } = await loadContentRemote<TeamMember[]>("team");

    const now = new Date().toISOString();
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: member.name || "",
      title: member.title || "",
      photo: member.photo || "",
      bio: member.bio || [],
      order: member.order ?? data.length,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...data, newMember].sort((a, b) => a.order - b.order);
    await saveContent("team", updated, sha || currentSha, `Add team member: ${newMember.name}`);

    return NextResponse.json({ member: newMember }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { member, sha } = await request.json();
    const { data, sha: currentSha } = await loadContentRemote<TeamMember[]>("team");

    const index = data.findIndex((m) => m.id === member.id);
    if (index === -1) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updatedMember: TeamMember = {
      ...data[index],
      ...member,
      updatedAt: now,
    };

    const updated = [...data];
    updated[index] = updatedMember;
    updated.sort((a, b) => a.order - b.order);

    await saveContent("team", updated, sha || currentSha, `Update team member: ${updatedMember.name}`);

    return NextResponse.json({ member: updatedMember });
  } catch {
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id, sha } = await request.json();
    const { data, sha: currentSha } = await loadContentRemote<TeamMember[]>("team");

    const member = data.find((m) => m.id === id);
    if (!member) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    const updated = data.filter((m) => m.id !== id);
    await saveContent("team", updated, sha || currentSha, `Remove team member: ${member.name}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
