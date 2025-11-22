"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function NewPostPage() {
  const router = useRouter();
  const { token, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token, router]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (loading) {
    return <div className="max-w-site mx-auto p-6 text-gray-400">Checking login status...</div>;
  }
  if (!token) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!token) return router.push("/login");

    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("content", content);
      if (file) form.append("image", file);

      const res = await fetch("http://127.0.0.1:8000/api/posts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // DO NOT set Content-Type (browser sets it)
        },
        body: form,
      });

      if (res.ok) {
        router.push("/");
      } else {
        const contentType = res.headers.get("content-type") || "";
        const data = contentType.includes("application/json") ? await res.json() : await res.text();
        alert("Error creating post: " + JSON.stringify(data));
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-centered max-w-site mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full p-2 border rounded bg-black/30"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Post title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            className="w-full p-2 border rounded bg-black/30"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Share your skills, project details, or art..."
            rows={8}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Optional image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && (
            <div className="mt-2">
              <img src={previewUrl} alt="preview" className="max-w-full max-h-60 object-contain rounded" />
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500">
            Example dev file url: <code>/mnt/data/13c1fb87-41af-42f6-90f1-9ffda5546e3d.png</code>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {submitting ? "Posting…" : "Create Post"}
        </button>
      </form>
    </div>
  );
}
