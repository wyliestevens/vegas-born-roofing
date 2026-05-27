import { NextResponse } from "next/server";
import { verifySession, getSessionCookie } from "@/lib/auth";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || "";
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "";

async function authenticate(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionCookie(cookieHeader);
  if (!token) return null;
  return verifySession(token);
}

// GET - list recent deployments
export async function GET(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
      return NextResponse.json(
        { error: "VERCEL_TOKEN and VERCEL_PROJECT_ID must be configured" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Vercel API error: ${res.status} ${text}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const deployments = (data.deployments || []).map(
      (d: {
        uid: string;
        url: string;
        state: string;
        created: number;
        meta?: { githubCommitMessage?: string };
        target: string | null;
      }) => ({
        id: d.uid,
        url: d.url,
        state: d.state?.toUpperCase() || "UNKNOWN",
        created: new Date(d.created).toISOString(),
        commitMessage: d.meta?.githubCommitMessage || "",
        target: d.target,
      })
    );

    return NextResponse.json({ deployments });
  } catch (err) {
    console.error("Deployments GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch deployments" },
      { status: 500 }
    );
  }
}

// POST - redeploy or promote (rollback)
export async function POST(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
      return NextResponse.json(
        { error: "VERCEL_TOKEN and VERCEL_PROJECT_ID must be configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { action, deploymentId } = body;

    if (action === "redeploy") {
      // Trigger a new production deployment
      const res = await fetch("https://api.vercel.com/v13/deployments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: VERCEL_PROJECT_ID,
          project: VERCEL_PROJECT_ID,
          target: "production",
          gitSource: {
            type: "github",
            repoId: VERCEL_PROJECT_ID,
            ref: "main",
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json(
          { error: `Redeploy failed: ${res.status} ${text}` },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true });
    }

    if (action === "rollback") {
      if (!deploymentId) {
        return NextResponse.json(
          { error: "deploymentId is required" },
          { status: 400 }
        );
      }

      // Promote a deployment to production
      const res = await fetch(
        `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/promote/${deploymentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${VERCEL_TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json(
          { error: `Promote failed: ${res.status} ${text}` },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Deployments POST error:", err);
    return NextResponse.json(
      { error: "Failed to process deployment action" },
      { status: 500 }
    );
  }
}
