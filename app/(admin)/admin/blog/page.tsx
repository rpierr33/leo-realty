"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Edit2, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";

type Post = {
  id: number;
  slug: string;
  title: string;
  category: string;
  isPublished: boolean;
  publishedAt?: string | null;
  readTimeMinutes: number;
  coverImageUrl: string;
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const togglePublished = async (id: number, current: boolean) => {
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, isPublished: !current } : p));
      toast.success(current ? "Post unpublished" : "Post published");
    } catch {
      toast.error("Failed to update post");
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  if (loading) return <div className="p-8 animate-pulse"><div className="h-64 bg-gray-200 rounded" /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)]">Blog Management</h1>
          <p className="text-gray-500 mt-1">{posts.length} posts</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#D4B96A] transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">No blog posts yet. Run the seed script to add sample posts.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">Title</th>
                  <th className="text-left p-4 font-medium text-gray-500">Category</th>
                  <th className="text-left p-4 font-medium text-gray-500">Read Time</th>
                  <th className="text-left p-4 font-medium text-gray-500">Published</th>
                  <th className="text-left p-4 font-medium text-gray-500">Date</th>
                  <th className="w-32 p-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-[#0A1628] line-clamp-1">{post.title}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#0A1628]/5 text-[#0A1628] text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                        {post.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{post.readTimeMinutes} min</td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublished(post.id, post.isPublished)}
                        className={`p-1.5 rounded-lg ${post.isPublished ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"}`}
                      >
                        {post.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="p-4 text-gray-400 text-xs">
                      {post.publishedAt ? formatDate(new Date(post.publishedAt)) : "Draft"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 bg-gray-50 hover:text-[#0A1628] transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 rounded-lg text-gray-400 bg-gray-50 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePost(post.id)} className="p-1.5 rounded-lg text-gray-400 bg-gray-50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
