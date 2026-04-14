import { Metadata } from "next";
import { Home, Users, MessageSquare, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { leads, properties, agents, blogPosts } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export const metadata: Metadata = { title: "Dashboard — Leo Realty Admin" };

async function getStats() {
  try {
    const [totalLeads, newLeads, totalProps, activeProps, teamCount, totalPosts] = await Promise.all([
      db.select({ count: count() }).from(leads),
      db.select({ count: count() }).from(leads).where(eq(leads.status, "new")),
      db.select({ count: count() }).from(properties),
      db.select({ count: count() }).from(properties).where(eq(properties.isPublished, true)),
      db.select({ count: count() }).from(agents).where(eq(agents.isActive, true)),
      db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.isPublished, true)),
    ]);
    return {
      totalLeads: totalLeads[0].count,
      newLeads: newLeads[0].count,
      totalProperties: totalProps[0].count,
      activeProperties: activeProps[0].count,
      teamMembers: teamCount[0].count,
      publishedPosts: totalPosts[0].count,
    };
  } catch {
    return { totalLeads: 0, newLeads: 0, totalProperties: 0, activeProperties: 0, teamMembers: 0, publishedPosts: 0 };
  }
}

async function getRecentLeads() {
  try {
    return await db
      .select({
        id: leads.id,
        firstName: leads.firstName,
        lastName: leads.lastName,
        email: leads.email,
        phone: leads.phone,
        interest: leads.interest,
        status: leads.status,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .orderBy(leads.createdAt)
      .limit(5);
  } catch {
    return [];
  }
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
  lost: "bg-red-100 text-red-700",
};

export default async function DashboardPage() {
  const [stats, recentLeads] = await Promise.all([getStats(), getRecentLeads()]);

  const statCards = [
    { label: "Total Leads", value: stats.totalLeads, sub: `${stats.newLeads} new`, icon: MessageSquare, color: "bg-blue-500", href: "/admin/leads" },
    { label: "Active Listings", value: stats.activeProperties, sub: `${stats.totalProperties} total`, icon: Home, color: "bg-[#C5A55A]", href: "/admin/listings" },
    { label: "Team Members", value: stats.teamMembers, sub: "Active agents", icon: Users, color: "bg-purple-500", href: "/admin/team" },
    { label: "Published Posts", value: stats.publishedPosts, sub: "Blog articles", icon: TrendingUp, color: "bg-green-500", href: "/admin/blog" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)]">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to Leo Realty CRM</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/leads" className="inline-flex items-center gap-2 bg-[#0A1628] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#162447] transition-colors">
            <Plus className="w-4 h-4" /> New Lead
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${card.color} bg-opacity-20 flex items-center justify-center`}>
                <card.icon className={`w-6 h-6`} style={{ color: card.color === "bg-[#C5A55A]" ? "#C5A55A" : undefined }} />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#C5A55A] transition-colors" />
            </div>
            <div className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-1">
              {card.value}
            </div>
            <div className="text-gray-500 text-sm">{card.label}</div>
            <div className="text-gray-400 text-xs mt-1">{card.sub}</div>
          </Link>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#0A1628] font-[var(--font-playfair)]">Recent Leads</h2>
          <Link href="/admin/leads" className="text-[#C5A55A] text-sm font-medium hover:underline">
            View All
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p>No leads yet. They&apos;ll appear here when clients submit inquiries.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0A1628]/10 flex items-center justify-center">
                    <span className="text-[#0A1628] font-bold text-sm">
                      {lead.firstName.charAt(0)}{lead.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1628] text-sm">
                      {lead.firstName} {lead.lastName}
                    </div>
                    <div className="text-gray-400 text-xs">{lead.email} · {lead.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs capitalize">{lead.interest}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {lead.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: "Add New Listing", href: "/admin/listings", icon: Home },
          { label: "Manage Team", href: "/admin/team", icon: Users },
          { label: "Create Blog Post", href: "/admin/blog", icon: TrendingUp },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm hover:border-[#C5A55A]/30 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0A1628]/5 flex items-center justify-center">
              <action.icon className="w-5 h-5 text-[#C5A55A]" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#0A1628]">{action.label}</span>
            <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#C5A55A] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
