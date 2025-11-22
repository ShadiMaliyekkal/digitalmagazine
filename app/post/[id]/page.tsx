"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { token, loading, user } = useAuth();

  const [post, setPost] = useState<any | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!token) return router.push("/login");
    setLiking(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/posts/${id}/like/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const refreshed = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`);
        setPost(await refreshed.json());
      } else {
        const err = await res.json();
        alert(JSON.stringify(err));
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e: any) => {
    e.preventDefault();
    if (!token) return router.push("/login");
    setSubmitting(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/posts/${id}/comment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ body: comment }),
      });
      if (res.ok) {
        setComment("");
        const refreshed = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`);
        setPost(await refreshed.json());
      } else {
        const err = await res.json();
        alert(JSON.stringify(err));
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return router.push("/login");
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        router.push("/");
      } else {
        const err = await res.json();
        alert("Delete failed: " + JSON.stringify(err));
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!post) return <div className="p-6 text-gray-400">Loading post…</div>;

  // owner check: ensure auth finished loading before deciding
  const isOwner = !loading && !!user && post.author?.username === user?.username;

  return (
    <div className="container-centered max-w-site mx-auto p-6">
      <a href="/" className="text-blue-500 mb-4 inline-block">← Back</a>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <div className="text-sm text-muted mb-4">
        by {post.author?.username} · {new Date(post.created_at).toLocaleString()}
      </div>

      {post.image_url && (
        <div className="mb-4">
          <img src={post.image_url} alt={post.title} className="w-full md:w-56 h-auto object-cover rounded" />
        </div>
      )}

      <div className="mb-4">{post.content}</div>

      <div className="flex items-center gap-3 mb-4">
        <button onClick={handleLike} disabled={liking} className="px-3 py-1 bg-blue-600 text-white rounded">
          Like ({post.likes_count ?? post.likes?.length ?? 0})
        </button>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            {deleting ? "Deleting…" : "Delete Post"}
          </button>
        )}
      </div>

      <section>
        <h2 className="font-semibold mb-2">Comments</h2>

        {post.comments?.length ? (
          post.comments.map((c: any) => (
            <div key={c.id} className="border p-3 rounded mb-2">
              <div className="text-sm font-semibold">{c.author?.username}</div>
              <div>{c.body}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 mb-2">No comments yet.</div>
        )}

        <form onSubmit={handleComment} className="mt-3">
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {submitting ? "Posting…" : "Add comment"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
