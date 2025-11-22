"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { token, user, logout, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full bg-black/60 backdrop-blur border-b border-gray-700 p-3 md:p-4">
      <div className="container-centered max-w-site flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">
            Jamia Magazine
          </Link>
        </div>

        {/* desktop menu */}
        <div className="items-center gap-4 hide-sm">
          {loading ? null : (
            <>
              {!token ? (
                <>
                  <Link href="/login" className="text-blue-400 hover:underline nav-touch">
                    Login
                  </Link>
                  <Link href="/register" className="text-blue-400 hover:underline nav-touch">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/new-post" className="px-3 py-1 bg-green-600 text-white rounded nav-touch">
                    + New Post
                  </Link>
                  <span className="text-gray-300 nav-touch">{user?.username}</span>
                  <button onClick={handleLogout} className="px-3 py-1 bg-red-600 text-white rounded nav-touch">
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* mobile burger */}
        <div className="show-sm">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="p-2 bg-black/30 rounded text-white"
          >
            {/* simple burger icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu panel */}
      {open && (
        <div className="md:hidden bg-black/50 border-t border-gray-800">
          <div className="px-4 py-3 space-y-2">
            {loading ? null : (
              <>
                {!token ? (
                  <>
                    <Link href="/login" className="block text-blue-400 hover:underline py-2">Login</Link>
                    <Link href="/register" className="block text-blue-400 hover:underline py-2">Register</Link>
                  </>
                ) : (
                  <>
                    <Link href="/new-post" className="block px-3 py-2 bg-green-600 text-white rounded">+ New Post</Link>
                    <div className="py-2 text-gray-300">{user?.username}</div>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 bg-red-600 text-white rounded">Logout</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
