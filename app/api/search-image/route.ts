import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json({ error: "UNSPLASH_ACCESS_KEY not set" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish&content_filter=high`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Unsplash error:", err);
      return NextResponse.json({ error: "Unsplash error" }, { status: 502 });
    }

    const data = await res.json();
    const photo = data.results?.[0];

    if (!photo) {
      return NextResponse.json({ imageUrl: null });
    }

    return NextResponse.json({
      imageUrl: photo.urls?.regular ?? photo.urls?.full ?? null,
      thumb:    photo.urls?.small   ?? null,
      credit: {
        name: photo.user?.name ?? "",
        link: photo.links?.html ?? "",
      },
    });
  } catch (err) {
    console.error("search-image error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
