// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BACKEND_BASE = "http://127.0.0.1:8000"; // adjust if your backend host/port differs

function buildImageUrl(imgField: string | null | undefined) {
  if (!imgField) return null;
  if (imgField.startsWith("http://") || imgField.startsWith("https://")) return imgField;
  if (imgField.startsWith("/")) return BACKEND_BASE + imgField;
  return BACKEND_BASE + "/" + imgField;
}

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE}/api/posts/`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main className="container-centered max-w-site mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Campus Magazine</h1>

      {loading ? (
        <div className="text-gray-400">Loading posts…</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-400">No posts yet.</div>
      ) : (
        <div className="space-y-6 mt-6">
          {posts.map((p) => {
            const imageUrl = buildImageUrl(p.image_url ?? p.image);
            return (
              <article key={p.id} className="card border p-4 rounded">
                <Link href={`/post/${p.id}`} className="block md:flex md:gap-6">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={p.title ?? "post image"}
                      className="w-full md:w-48 md:h-32 object-cover mb-3 md:mb-0 rounded"
                    />
                  )}

                  <div>
                    <h2 className="text-xl font-semibold">{p.title}</h2>
                    <p className="mt-2 line-clamp-3 text-gray-200">{p.content}</p>
                    <div className="text-sm text-muted mt-3">
                      by {p.author?.username} · {new Date(p.created_at).toLocaleString()}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
