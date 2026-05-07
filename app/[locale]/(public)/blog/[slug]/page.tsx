import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { blogPosts, agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatDate } from "@/lib/utils/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    if (!post) return { title: "Post Not Found" };
    return { title: post.title, description: post.excerpt };
  } catch {
    return { title: "Blog Post" };
  }
}

const FALLBACK_POSTS_DATA: Record<string, {
  title: string;
  excerpt: string;
  legacyContent: string;
  coverImageUrl: string;
  publishedAt: Date;
  readTimeMinutes: number;
  authorName: string;
  category: string;
  tags: string[];
}> = {
  "investing-in-real-estate": {
    title: "Investing in Real Estate: A Complete Guide",
    excerpt: "Real estate remains one of the most powerful wealth-building tools available.",
    legacyContent: `# Investing in Real Estate: A Complete Guide

Real estate investment has long been one of the most reliable paths to building wealth. Unlike stocks or bonds, real estate provides tangible assets that can generate passive income while appreciating in value over time.

## Why Invest in Real Estate?

South Florida's real estate market has consistently outperformed national averages. With strong population growth, a thriving economy, and limited land availability, the region continues to attract both domestic and international buyers.

**Key benefits of real estate investing:**
- Passive monthly income through rental properties
- Long-term appreciation in property value
- Tax advantages (depreciation, mortgage interest deductions)
- Portfolio diversification
- Hedge against inflation

## Types of Investment Properties

**Single-Family Homes:** The entry point for most investors. Lower purchase price, easier management, and strong rental demand make these ideal for beginners.

**Multi-Family Properties:** Duplexes, triplexes, and apartment buildings generate higher income per investment dollar. One vacancy doesn't eliminate all income.

**Commercial Real Estate:** Higher returns with longer lease terms. Tenants often cover operating expenses. Requires larger capital but generates substantial income.

**Short-Term Rentals:** Platforms like Airbnb have created opportunities for significantly higher returns in tourist areas like Miami Beach and Ft. Lauderdale.

## Financing Your Investment

KLE Mortgage's loan originators (our lending partner) offers several programs specifically designed for investment properties:

- **DSCR Loans:** Qualify based on rental income, not personal income
- **Conventional Investment Loans:** 20-25% down, competitive rates
- **Portfolio Loans:** Multiple properties under one loan

## Getting Started

Contact Leo Realty today for a free investment consultation. Our experienced team will help you identify properties, analyze returns, and secure the right financing.`,
    coverImageUrl: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&q=80",
    publishedAt: new Date("2024-01-15"),
    readTimeMinutes: 8,
    authorName: "Leopold Evariste",
    category: "investing",
    tags: ["investing", "wealth", "portfolio"],
  },
  "investment-properties-south-florida": {
    title: "Investment Properties in South Florida",
    excerpt: "South Florida's real estate market continues to offer exceptional investment opportunities.",
    legacyContent: `# Investment Properties in South Florida

South Florida remains one of the hottest real estate markets in the United States. With year-round sunshine, no state income tax, and a rapidly growing population, the region offers exceptional opportunities for real estate investors.

## Top Investment Markets

**Miami-Dade County:** The urban core offers strong rental demand from a diverse, growing population. Areas like Brickell, Wynwood, and Little Haiti have seen significant appreciation.

**Broward County:** More affordable than Miami-Dade but equally strong rental demand. Hollywood, Pembroke Pines, and Davie offer excellent value.

**Palm Beach County:** Growing tech sector and retiree migration creating strong demand for both rentals and purchases.

## What to Look For

When evaluating investment properties, consider:

1. **Cap Rate:** Net operating income divided by property value. Aim for 5-8% in South Florida.
2. **Cash-on-Cash Return:** Annual cash flow divided by down payment. Target 8-12%.
3. **Neighborhood Trends:** Population growth, new businesses, infrastructure improvements.
4. **Rental Demand:** Vacancy rates, average days on market, rent trends.

## The Leo Realty Advantage

Our investment specialists have decades of experience in the South Florida market. We provide:
- Off-market property access
- Detailed investment analysis
- Financing through our in-house mortgage team
- Property management referrals
- 1031 exchange guidance

Ready to start investing? Contact Leo Realty today.`,
    coverImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    publishedAt: new Date("2024-02-20"),
    readTimeMinutes: 6,
    authorName: "Jean Samuel Luxama",
    category: "investing",
    tags: ["south florida", "investment", "market"],
  },
  "hometown-heroes-program": {
    title: "Understanding the Hometown Heroes Program",
    excerpt: "Florida's Hometown Heroes Housing Program is changing lives for frontline workers.",
    legacyContent: `# Understanding the Hometown Heroes Program

Florida's Hometown Heroes Housing Program is one of the most significant housing assistance initiatives in the state's history. Designed to help frontline workers achieve homeownership, this program provides substantial financial assistance to eligible buyers.

## Who Qualifies?

The program serves Florida's essential workers, including:
- **Teachers** and educational professionals
- **Nurses** and healthcare workers
- **Law enforcement** officers
- **Firefighters** and EMTs
- **Military** veterans and active service members
- **Child care** workers
- Many other community service professions

## What Benefits Are Available?

Eligible buyers can receive:
- Up to **5% of the loan amount** in down payment assistance
- Up to **$35,000** in assistance (program limits apply)
- Below-market interest rates on the first mortgage
- A 0% interest, non-amortizing second mortgage for assistance

## How to Apply

1. **Speak with a KLE Mortgage loan originator (our lending partner)** for a free eligibility assessment
2. Complete homebuyer education course (required)
3. Get pre-approved for your first mortgage
4. Find your dream home with Leo Realty
5. Apply for Hometown Heroes assistance at closing

## Why Use KLE Mortgage Through Leo Realty for Hometown Heroes?

Our team has extensive experience with the Hometown Heroes program and has helped dozens of frontline workers become homeowners. We guide you through every step and maximize the benefits available to you.

Contact us today to find out if you qualify.`,
    coverImageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=80",
    publishedAt: new Date("2024-03-10"),
    readTimeMinutes: 5,
    authorName: "Olivier Desire",
    category: "mortgage_tips",
    tags: ["hometown heroes", "first-time buyer", "down payment assistance"],
  },
};

// Map fallback slugs to translation keys for translated content body
const FALLBACK_CONTENT_KEYS: Record<string, "p1Content" | "p2Content" | "p3Content"> = {
  "investing-in-real-estate": "p1Content",
  "investment-properties-south-florida": "p2Content",
  "hometown-heroes-program": "p3Content",
};

export default async function BlogPostPage({ params }: Props) {
  const t = await getTranslations("BlogPost");
  const tBlog = await getTranslations("BlogContent");
  const { slug } = await params;

  let post = null;
  let authorName = null;

  try {
    const rows = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        coverImageUrl: blogPosts.coverImageUrl,
        category: blogPosts.category,
        tags: blogPosts.tags,
        readTimeMinutes: blogPosts.readTimeMinutes,
        publishedAt: blogPosts.publishedAt,
        authorName: agents.name,
      })
      .from(blogPosts)
      .leftJoin(agents, eq(blogPosts.authorId, agents.id))
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (rows[0]) {
      post = rows[0];
      authorName = rows[0].authorName;
    }
  } catch {
    // fallback
  }

  const fallback = FALLBACK_POSTS_DATA[slug];
  if (!post && !fallback) notFound();

  // For fallback posts, pull the translated content from the catalog
  const fallbackContentKey = FALLBACK_CONTENT_KEYS[slug];
  const fallbackContent = fallbackContentKey
    ? tBlog(fallbackContentKey)
    : fallback?.legacyContent ?? "";

  const displayPost = post ?? {
    id: 0,
    slug,
    ...fallback!,
    content: fallbackContent,
  };
  const displayAuthor = authorName ?? (displayPost as { authorName?: string }).authorName;

  return (
    <div className="pt-24 pb-24 bg-[#F8F7F4] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C5A55A] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {t("backToBlog")}
        </Link>

        <article className="bg-white rounded-3xl overflow-hidden border border-gray-100">
          <div className="h-72 md:h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displayPost.coverImageUrl ?? ""} alt={displayPost.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
              {displayPost.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(displayPost.publishedAt)}
                </span>
              )}
              {displayPost.readTimeMinutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {t("minRead", { minutes: displayPost.readTimeMinutes })}
                </span>
              )}
              {displayAuthor && (
                <span>{t("byAuthor")} <span className="text-[#C5A55A] font-medium">{displayAuthor}</span></span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-6 leading-tight">
              {displayPost.title}
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-8 border-l-4 border-[#C5A55A] pl-5">
              {displayPost.excerpt}
            </p>

            <div className="prose prose-lg prose-gray max-w-none">
              {(displayPost.content ?? "").split('\n\n').map((paragraph: string, i: number) => {
                if (paragraph.startsWith('# ')) return null;
                if (paragraph.startsWith('## ')) {
                  return <h2 key={i} className="text-2xl font-bold text-[#0A1628] font-[var(--font-playfair)] mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                  const parts = paragraph.split('\n');
                  return (
                    <div key={i}>
                      {parts.map((p, j) => {
                        if (p.startsWith('**') && p.includes(':**')) {
                          const [bold, ...rest] = p.split(':**');
                          return <p key={j} className="mb-2 text-gray-700"><strong className="text-[#0A1628]">{bold.replace(/\*\*/g, '')}:</strong> {rest.join(':**')}</p>;
                        }
                        return <p key={j} className="mb-2 text-gray-700">{p}</p>;
                      })}
                    </div>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter((l: string) => l.startsWith('- '));
                  return (
                    <ul key={i} className="list-disc pl-6 mb-4 space-y-1">
                      {items.map((item, j) => (
                        <li key={j} className="text-gray-700">{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.match(/^\d+\./)) {
                  const items = paragraph.split('\n').filter((l: string) => l.match(/^\d+\./));
                  return (
                    <ol key={i} className="list-decimal pl-6 mb-4 space-y-1">
                      {items.map((item, j) => (
                        <li key={j} className="text-gray-700">{item.replace(/^\d+\.\s/, '')}</li>
                      ))}
                    </ol>
                  );
                }
                return <p key={i} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>;
              })}
            </div>

            {displayPost.tags && (displayPost.tags as string[]).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-100">
                {(displayPost.tags as string[]).map((tag) => (
                  <span key={tag} className="bg-[#0A1628]/5 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        <div className="mt-8 bg-[#0A1628] rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white font-[var(--font-playfair)] mb-3">{t("ctaTitle")}</h3>
          <p className="text-white/60 mb-6">{t("ctaSubcopy")}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold px-8 py-4 rounded-full hover:bg-[#D4B96A] transition-colors">
            {t("ctaButton")}
          </Link>
        </div>
      </div>
    </div>
  );
}
