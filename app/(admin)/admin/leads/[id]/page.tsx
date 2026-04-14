"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";

type Lead = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  status: string;
  source?: string | null;
  message?: string | null;
  notes?: string | null;
  createdAt: string;
};

const STATUS_OPTIONS = ["new", "contacted", "qualified", "closed", "lost"];
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
  lost: "bg-red-100 text-red-700",
};

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setLead(data);
        setNotes(data.notes ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setLead((prev) => prev ? { ...prev, status } : prev);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error();
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Lead not found.</p>
        <Link href="/admin/leads" className="text-[#C5A55A] underline mt-4 block">
          ← Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C5A55A] transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#0A1628]/10 flex items-center justify-center">
                <User className="w-7 h-7 text-[#0A1628]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-playfair)]">
                  {lead.firstName} {lead.lastName}
                </h1>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[lead.status]}`}>
                  {lead.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href={`mailto:${lead.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#F8F7F4] transition-colors">
                <Mail className="w-5 h-5 text-[#C5A55A]" />
                <div>
                  <div className="text-xs text-gray-400">Email</div>
                  <div className="text-sm font-medium text-[#0A1628]">{lead.email}</div>
                </div>
              </a>
              <a href={`tel:${lead.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#F8F7F4] transition-colors">
                <Phone className="w-5 h-5 text-[#C5A55A]" />
                <div>
                  <div className="text-xs text-gray-400">Phone</div>
                  <div className="text-sm font-medium text-[#0A1628]">{lead.phone}</div>
                </div>
              </a>
              <div className="p-3 rounded-xl bg-gray-50">
                <div className="text-xs text-gray-400 mb-1">Interest</div>
                <div className="text-sm font-medium text-[#0A1628] capitalize">{lead.interest}</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <div className="text-xs text-gray-400 mb-1">Source</div>
                <div className="text-sm font-medium text-[#0A1628]">{lead.source ?? "—"}</div>
              </div>
            </div>

            {lead.message && (
              <div className="mt-4 p-4 bg-[#F8F7F4] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Message
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{lead.message}</p>
              </div>
            )}

            {lead.createdAt && (
              <p className="text-gray-400 text-xs mt-4">Received: {formatDate(new Date(lead.createdAt))}</p>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">Agent Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Add notes about this lead..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[#C5A55A]"
            />
            <Button
              onClick={saveNotes}
              disabled={savingNotes}
              className="mt-3 bg-[#0A1628] text-white hover:bg-[#162447] rounded-xl"
            >
              {savingNotes ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>

        {/* Status sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">Update Status</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={savingStatus || lead.status === s}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors capitalize ${
                    lead.status === s
                      ? "bg-[#0A1628] text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
