import { useState } from "react";

export default function PostForm({onPosted}:{onPosted?:()=>void}){
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:8000/api/posts/", {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({title, content})
      });
      if (res.ok) {
        setTitle(''); setContent('');
        if (onPosted) onPosted();
      } else {
        const err = await res.json();
        alert(JSON.stringify(err));
      }
    } catch (err:any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <input className="w-full p-2 mb-2 border" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      <textarea className="w-full p-2 mb-2 border" value={content} onChange={e=>setContent(e.target.value)} placeholder="Share your skills, projects, or art..." />
      <button className="px-4 py-2 bg-green-600 text-white rounded">Post</button>
    </form>
  );
}
