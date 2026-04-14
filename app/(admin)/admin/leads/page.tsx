import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { leads, agents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { MessageSquare, Phone, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Leads — Leo Realty Admin" };

async function getLeads() {
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
        source: leads.source,
        createdAt: leads.createdAt,
        agentName: agents.name,
      })
      .from(leads)
      .leftJoin(agents, eq(leads.assignedAgentId, agents.id))
      .orderBy(leads.createdAt);
  } catch {
    return [];
  }
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-700" },
  qualified: { label: "Qualified", color: "bg-green-100 text-green-700" },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-700" },
  lost: { label: "Lost", color: "bg-red-100 text-red-700" },
};

const PIPELINE_STAGES = ["new", "contacted", "qualified", "closed", "lost"];

export default async function LeadsPage() {
  const allLeads = await getLeads();

  const grouped = PIPELINE_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = allLeads.filter((l) => l.status === stage);
      return acc;
    },
    {} as Record<string, typeof allLeads>
  );

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)]">Lead Pipeline</h1>
          <p className="text-gray-500 mt-1">{allLeads.length} total leads</p>
        </div>
      </div>

      {allLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No leads yet</h3>
          <p className="text-gray-400 text-sm mt-2">Leads will appear here when clients submit contact forms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {PIPELINE_STAGES.map((stage) => {
            const config = STATUS_CONFIG[stage];
            const stageLeads = grouped[stage] ?? [];
            return (
              <div key={stage} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-gray-400 text-xs font-medium">{stageLeads.length}</span>
                  </div>
                </div>
                <div className="p-2 space-y-2 min-h-32">
                  {stageLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/admin/leads/${lead.id}`}
                      className="block p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                    >
                      <div className="font-semibold text-[#0A1628] text-sm mb-1">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-gray-400 text-xs capitalize mb-2">{lead.interest}</div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                      {lead.createdAt && (
                        <div className="text-gray-300 text-xs mt-2">
                          {formatDate(lead.createdAt)}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table view */}
      {allLeads.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-[#0A1628] font-[var(--font-playfair)]">All Leads</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-500">Name</th>
                  <th className="text-left p-4 font-medium text-gray-500">Contact</th>
                  <th className="text-left p-4 font-medium text-gray-500">Interest</th>
                  <th className="text-left p-4 font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500">Assigned</th>
                  <th className="text-left p-4 font-medium text-gray-500">Date</th>
                  <th className="w-16" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allLeads.map((lead) => {
                  const config = STATUS_CONFIG[lead.status];
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-[#0A1628]">
                        {lead.firstName} {lead.lastName}
                      </td>
                      <td className="p-4">
                        <div className="text-gray-600 text-xs">{lead.email}</div>
                        <div className="text-gray-400 text-xs">{lead.phone}</div>
                      </td>
                      <td className="p-4 capitalize text-gray-600">{lead.interest}</td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config?.color}`}>
                          {config?.label}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-xs">{lead.agentName ?? "—"}</td>
                      <td className="p-4 text-gray-400 text-xs">
                        {lead.createdAt ? formatDate(lead.createdAt) : "—"}
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-[#C5A55A] text-xs font-medium hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
