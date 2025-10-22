"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@/components/AuthButton";

interface Export {
  id: string;
  created_at: number;
  views: number;
}

export default function MyExportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [exports, setExports] = useState<Export[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      fetchExports();
    }
  }, [status, router]);

  const fetchExports = async () => {
    try {
      const response = await fetch("/api/my-exports");
      if (response.ok) {
        const data = await response.json();
        setExports(data.exports);
      }
    } catch (error) {
      console.error("Failed to fetch exports:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteExport = async (id: string) => {
    if (!confirm("Delete this export?")) return;

    try {
      const response = await fetch(`/api/exports/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExports(exports.filter((e) => e.id !== id));
      } else {
        alert("Failed to delete export");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete export");
    }
  };

  const copyUrl = async (id: string) => {
    const url = `${window.location.origin}?id=${id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("URL copied!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Exports</h1>
          <div className="flex items-center gap-4">
            {session && (
              <span className="text-sm text-gray-600">{session.user?.email}</span>
            )}
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              ← Home
            </button>
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {exports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No exports yet</p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 text-sm bg-[#C15F3C] hover:bg-[#A14F30] text-white rounded-lg transition"
            >
              Create your first export
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {exports.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Created: {new Date(exp.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Views: {exp.views}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    ID: {exp.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/?id=${exp.id}`)}
                    className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => copyUrl(exp.id)}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => deleteExport(exp.id)}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
