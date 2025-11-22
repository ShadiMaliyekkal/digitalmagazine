import React from "react";
import { useRouter } from 'next/router';

export default function PostCard({post, onUpdate}:{post:any, onUpdate?:()=>void}){
  const router = useRouter();

  return (
    <div className="border rounded p-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold">{post.author.username}</div>
          <div className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleString()}</div>
        </div>
        <div className="text-sm">{post.likes_count} likes</div>
      </div>
      <h2 className="text-lg font-bold mt-2">{post.title}</h2>
      <p className="mt-2">{post.content.slice(0, 200)}{post.content.length>200? '...' : ''}</p>
      <div className="mt-3 flex gap-2">
        <button onClick={()=> router.push(`/post/${post.id}`)} className="px-3 py-1 border rounded">Open</button>
      </div>
    </div>
  );
}
