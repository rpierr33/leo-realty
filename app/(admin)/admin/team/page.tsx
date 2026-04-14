"use client";

import { useEffect, useState } from "react";
import { Users, Phone, Mail, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Agent = {
  id: number;
  name: string;
  title: string;
  role: string;
  phone: string;
  email: string;
  avatarUrl?: string | null;
  specialties?: string[];
  yearsExperience: number;
  isActive: boolean;
};

export default function TeamAdminPage() {
  const [team, setTeam] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((data) => { setTeam(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const deactivate = async (id: number) => {
    if (!confirm("Deactivate this team member? They will be hidden from the public site.")) return;
    try {
      const res = await fetch(`/api/agents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });
      if (!res.ok) throw new Error();
      setTeam((prev) => prev.filter((a) => a.id !== id));
      toast.success("Team member deactivated");
    } catch {
      toast.error("Failed to deactivate");
    }
  };

  if (loading) {
    return <div className="p-8 animate-pulse"><div className="h-64 bg-gray-200 rounded" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)]">Team Management</h1>
          <p className="text-gray-500 mt-1">{team.length} active members</p>
        </div>
      </div>

      {team.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">No team members found. Run the seed script to add them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {team.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0A1628]/10 flex-shrink-0">
                  {member.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0A1628]">
                      <span className="text-white font-bold font-[var(--font-playfair)]">{member.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#0A1628] font-[var(--font-playfair)]">{member.name}</div>
                  <div className="text-[#C5A55A] text-sm">{member.title}</div>
                  <div className="text-gray-400 text-xs mt-1 capitalize">{member.role.replace(/_/g, ' ')}</div>
                </div>
              </div>
              <div className="space-y-1.5 mb-4">
                <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-gray-500 text-xs hover:text-[#C5A55A] transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {member.phone}
                </a>
                <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-gray-500 text-xs hover:text-[#C5A55A] transition-colors truncate">
                  <Mail className="w-3.5 h-3.5" /> {member.email}
                </a>
              </div>
              {member.specialties && member.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {(member.specialties as string[]).slice(0, 2).map((s) => (
                    <span key={s} className="bg-[#0A1628]/5 text-[#0A1628] text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl py-2 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => deactivate(member.id)}
                  className="flex items-center justify-center gap-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-xl px-3 py-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
