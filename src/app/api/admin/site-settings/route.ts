import { NextResponse } from "next/server";
import { getSessionCookie, verifySession } from "@/lib/auth";
import { loadContentRemote, saveContent } from "@/lib/admin-content";

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  tagline: string;
  hours: string;
  licenses: {
    nevada: string;
    utah: string;
    arizona: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    yelp: string;
    google: string;
  };
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

    const { data, sha } = await loadContentRemote<SiteSettings>("site-settings");
    return NextResponse.json({ settings: data, sha });
  } catch {
    return NextResponse.json({ error: "Failed to load site settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await authenticate(request);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { settings, sha } = await request.json();
    const { sha: currentSha } = await loadContentRemote<SiteSettings>("site-settings");

    const updatedSettings: SiteSettings = {
      phone: settings.phone || "",
      email: settings.email || "",
      address: settings.address || "",
      tagline: settings.tagline || "",
      hours: settings.hours || "",
      licenses: {
        nevada: settings.licenses?.nevada || "",
        utah: settings.licenses?.utah || "",
        arizona: settings.licenses?.arizona || "",
      },
      socialLinks: {
        facebook: settings.socialLinks?.facebook || "",
        instagram: settings.socialLinks?.instagram || "",
        yelp: settings.socialLinks?.yelp || "",
        google: settings.socialLinks?.google || "",
      },
    };

    await saveContent("site-settings", updatedSettings, sha || currentSha, "Update site settings");

    return NextResponse.json({ settings: updatedSettings });
  } catch {
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}
