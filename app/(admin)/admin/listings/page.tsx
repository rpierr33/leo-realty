"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils/format";

type Property = {
  id: number;
  slug: string;
  title: string;
  price: string;
  status: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  city: string;
  state: string;
  isFeatured: boolean;
  isPublished: boolean;
  images?: { url: string }[];
};

export default function ListingsAdminPage() {
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => { setListings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleField = async (id: number, field: "isFeatured" | "isPublished", current: boolean) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !current }),
      });
      if (!res.ok) throw new Error();
      setListings((prev) => prev.map((p) => p.id === id ? { ...p, [field]: !current } : p));
      toast.success(`Property ${field === "isFeatured" ? (current ? "unfeatured" : "featured") : (current ? "unpublished" : "published")}`);
    } catch {
      toast.error("Failed to update property");
    }
  };

  const deleteProperty = async (id: number) => {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setListings((prev) => prev.filter((p) => p.id !== id));
      toast.success("Property deleted");
    } catch {
      toast.error("Failed to delete property");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)]">Listings</h1>
          <p className="text-gray-500 mt-1">{listings.length} properties</p>
        </div>
        <Button className="bg-[#C5A55A] text-[#0A1628] font-bold hover:bg-[#D4B96A] rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Add Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Home className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No listings yet</h3>
          <p className="text-gray-400 text-sm mt-2">Add your first property to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">Property</th>
                  <th className="text-left p-4 font-medium text-gray-500">Price</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500">Location</th>
                  <th className="text-left p-4 font-medium text-gray-500">Published</th>
                  <th className="text-left p-4 font-medium text-gray-500">Featured</th>
                  <th className="w-32 p-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {listings.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {p.images?.[0]?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0A1628]/10">
                              <Home className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0A1628] text-sm line-clamp-1">{p.title}</div>
                          <div className="text-gray-400 text-xs capitalize">{p.propertyType.replace(/_/g, ' ')} · {p.bedrooms}bd {p.bathrooms}ba</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-[#C5A55A]">{formatPrice(p.price)}</td>
                    <td className="p-4">
                      <span className="bg-[#0A1628]/5 text-[#0A1628] text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{p.city}, {p.state}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleField(p.id, "isPublished", p.isPublished)}
                        className={`p-1.5 rounded-lg ${p.isPublished ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"}`}
                      >
                        {p.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleField(p.id, "isFeatured", p.isFeatured)}
                        className={`p-1.5 rounded-lg ${p.isFeatured ? "text-[#C5A55A] bg-[#C5A55A]/10" : "text-gray-400 bg-gray-50"}`}
                      >
                        <Star className={`w-4 h-4 ${p.isFeatured ? "fill-[#C5A55A]" : ""}`} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/properties/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-gray-400 bg-gray-50 hover:text-[#0A1628] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-1.5 rounded-lg text-gray-400 bg-gray-50 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProperty(p.id)}
                          className="p-1.5 rounded-lg text-gray-400 bg-gray-50 hover:text-red-500 transition-colors"
                        >
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
