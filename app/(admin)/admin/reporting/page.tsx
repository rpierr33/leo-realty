import { Metadata } from "next";
import { db } from "@/lib/db";
import { leads, properties, agents } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { BarChart2, TrendingUp, Users, Home, MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "Reporting — Leo Realty Admin" };

async function getReportData() {
  try {
    const [
      totalLeads, newLeads, contactedLeads, qualifiedLeads, closedLeads,
      totalProps, forSaleProps, forRentProps, activeTeam,
    ] = await Promise.all([
      db.select({ count: count() }).from(leads),
      db.select({ count: count() }).from(leads).where(eq(leads.status, "new")),
      db.select({ count: count() }).from(leads).where(eq(leads.status, "contacted")),
      db.select({ count: count() }).from(leads).where(eq(leads.status, "qualified")),
      db.select({ count: count() }).from(leads).where(eq(leads.status, "closed")),
      db.select({ count: count() }).from(properties),
      db.select({ count: count() }).from(properties).where(eq(properties.status, "for_sale")),
      db.select({ count: count() }).from(properties).where(eq(properties.status, "for_rent")),
      db.select({ count: count() }).from(agents).where(eq(agents.isActive, true)),
    ]);
    return {
      leads: { total: totalLeads[0].count, new: newLeads[0].count, contacted: contactedLeads[0].count, qualified: qualifiedLeads[0].count, closed: closedLeads[0].count },
      properties: { total: totalProps[0].count, forSale: forSaleProps[0].count, forRent: forRentProps[0].count },
      team: { active: activeTeam[0].count },
    };
  } catch {
    return { leads: { total: 0, new: 0, contacted: 0, qualified: 0, closed: 0 }, properties: { total: 0, forSale: 0, forRent: 0 }, team: { active: 0 } };
  }
}

export default async function ReportingPage() {
  const data = await getReportData();

  const conversionRate = data.leads.total > 0
    ? Math.round((data.leads.closed / data.leads.total) * 100)
    : 0;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)]">Reporting</h1>
        <p className="text-gray-500 mt-1">Business performance overview</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Leads", value: data.leads.total, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Total Properties", value: data.properties.total, icon: Home, color: "text-[#C5A55A]", bg: "bg-[#C5A55A]/10" },
          { label: "Active Team", value: data.team.active, icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-1">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Lead funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-[#0A1628] font-[var(--font-playfair)] mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#C5A55A]" />
            Lead Pipeline
          </h2>
          <div className="space-y-4">
            {[
              { label: "New", count: data.leads.new, color: "bg-blue-500" },
              { label: "Contacted", count: data.leads.contacted, color: "bg-yellow-500" },
              { label: "Qualified", count: data.leads.qualified, color: "bg-green-500" },
              { label: "Closed", count: data.leads.closed, color: "bg-[#C5A55A]" },
            ].map((stage) => {
              const pct = data.leads.total > 0 ? Math.round((stage.count / data.leads.total) * 100) : 0;
              return (
                <div key={stage.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-600">{stage.label}</span>
                    <span className="text-sm font-bold text-[#0A1628]">{stage.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${stage.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-[#0A1628] font-[var(--font-playfair)] mb-6 flex items-center gap-2">
            <Home className="w-5 h-5 text-[#C5A55A]" />
            Property Breakdown
          </h2>
          <div className="space-y-4">
            {[
              { label: "For Sale", count: data.properties.forSale, total: data.properties.total, color: "bg-green-500" },
              { label: "For Rent", count: data.properties.forRent, total: data.properties.total, color: "bg-blue-500" },
            ].map((item) => {
              const pct = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    <span className="text-sm font-bold text-[#0A1628]">{item.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-[#F8F7F4] rounded-xl">
            <div className="text-sm text-gray-500 mb-2">Team Performance</div>
            <div className="flex items-center justify-between">
              <span className="text-[#0A1628] font-semibold">{data.team.active} Active Agents</span>
              <span className="text-[#C5A55A] text-sm font-medium">View Details →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
