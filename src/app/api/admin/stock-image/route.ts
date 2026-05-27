import { NextResponse } from "next/server";
import { verifySession, getSessionCookie } from "@/lib/auth";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getSessionCookie(cookieHeader);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await verifySession(token);
    if (!session) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "roofing";

    if (UNSPLASH_ACCESS_KEY) {
      // Use Unsplash API if key is available
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const photo = data.results[0];
          return NextResponse.json({
            url: photo.urls.regular,
            credit: `Photo by ${photo.user.name} on Unsplash`,
          });
        }
      }
    }

    // Fallback: use Unsplash Source (no API key needed, returns a random image)
    const url = `https://source.unsplash.com/1200x630/?${encodeURIComponent(query)}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[stock-image]", err);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
