import { Metadata } from "next";
import Link from "next/link";
import { Clock, Tag, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { blogPosts, agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Blog & Resources — Real Estate Insights",
  description:
    "Stay informed with Leo Realty's blog. Expert insights on real estate investing, mortgage tips, market updates, and homebuying guides.",
};

export const revalidate = 300;

async function getPosts() {
  try {
    return await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        coverImageUrl: blogPosts.coverImageUrl,
        category: blogPosts.category,
        tags: blogPosts.tags,
        readTimeMinutes: blogPosts.readTimeMinutes,
        publishedAt: blogPosts.publishedAt,
        authorName: agents.name,
      })
      .from(blogPosts)
      .leftJoin(agents, eq(blogPosts.authorId, agents.id))
      .where(eq(blogPosts.isPublished, true))
      .orderBy(blogPosts.publishedAt);
  } catch {
    return [];
  }
}

const FALLBACK_POSTS = [
  {
    id: 1,
    slug: "investing-in-real-estate",
    title: "Investing in Real Estate: A Complete Guide",
    excerpt: "Real estate remains one of the most powerful wealth-building tools available. Whether you're a first-time investor or looking to expand your portfolio, this guide covers everything you need to know.",
    coverImageUrl: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&q=80",
    category: "investing" as const,
    tags: ["investing", "wealth", "portfolio"],
    readTimeMinutes: 8,
    publishedAt: new Date("2024-01-15"),
    authorName: "Leopold Evariste",
  },
  {
    id: 2,
    slug: "investment-properties-south-florida",
    title: "Investment Properties in South Florida",
    excerpt: "South Florida's real estate market continues to offer exceptional investment opportunities. Learn about the best neighborhoods, property types, and financing strategies for maximizing returns.",
    coverImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    category: "investing" as const,
    tags: ["south florida", "investment", "market"],
    readTimeMinutes: 6,
    publishedAt: new Date("2024-02-20"),
    authorName: "Jean Samuel Luxama",
  },
  {
    id: 3,
    slug: "hometown-heroes-program",
    title: "Understanding the Hometown Heroes Program",
    excerpt: "Florida's Hometown Heroes Housing Program is changing lives for frontline workers. Teachers, nurses, law enforcement, and more can now access down payment assistance to achieve homeownership.",
    coverImageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80",
    category: "mortgage_tips" as const,
    tags: ["hometown heroes", "first-time buyer", "down payment assistance"],
    readTimeMinutes: 5,
    publishedAt: new Date("2024-03-10"),
    authorName: "Olivier Desire",
  },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  investing: { label: "Investing", color: "bg-purple-100 text-purple-700" },
  market_update: { label: "Market Update", color: "bg-blue-100 text-blue-700" },
  mortgage_tips: { label: "Mortgage Tips", color: "bg-green-100 text-green-700" },
  buying_tips: { label: "Buying Tips", color: "bg-orange-100 text-orange-700" },
  selling_tips: { label: "Selling Tips", color: "bg-red-100 text-red-700" },
  company_news: { label: "Company News", color: "bg-gray-100 text-gray-700" },
};

export default async function BlogPage() {
  const dbPosts = await getPosts();
  const posts = dbPosts.length > 0 ? dbPosts : FALLBACK_POSTS;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
            <span className="text-[#C5A55A] text-sm font-medium">Blog & Resources</span>
          </div>
          <h1 className="text-5xl font-bold text-white font-[var(--font-playfair)] mb-4">
            Real Estate{" "}
            <span className="text-[#C5A55A]">Insights</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl">
            Expert guidance on buying, selling, investing, and financing real estate
            in South Florida — from the Leo Realty team.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {posts.map((post) => {
                const catConfig = CATEGORY_LABELS[post.category] ?? { label: post.category, color: "bg-gray-100 text-gray-700" };
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${catConfig.color}`}>
                          {catConfig.label}
                        </span>
                        {post.readTimeMinutes && (
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTimeMinutes} min read
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-[#0A1628] font-[var(--font-playfair)] mb-2 group-hover:text-[#C5A55A] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {post.publishedAt && (
                          <span className="text-gray-400 text-xs">{formatDate(post.publishedAt)}</span>
                        )}
                        <span className="text-[#C5A55A] text-sm font-medium flex items-center gap-1">
                          Read More <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {(post.tags as string[]).slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
