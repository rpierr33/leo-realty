// Round-robin agent assignment, weighted by current open-lead load.
// Picks the active realtor with the fewest leads in {new, contacted}.
import { db } from "@/lib/db";
import { agents, leads } from "@/lib/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

export async function pickAgentForLead(): Promise<{ id: number; name: string } | null> {
  try {
    const realtors = await db
      .select({ id: agents.id, name: agents.name })
      .from(agents)
      .where(and(eq(agents.role, "realtor"), eq(agents.isActive, true)));

    if (realtors.length === 0) return null;

    const counts = await db
      .select({ agentId: leads.assignedAgentId, count: sql<number>`count(*)::int` })
      .from(leads)
      .where(inArray(leads.status, ["new", "contacted"]))
      .groupBy(leads.assignedAgentId);

    const countMap = new Map<number, number>();
    for (const row of counts) {
      if (row.agentId !== null) countMap.set(row.agentId, row.count);
    }

    const sorted = [...realtors].sort((a, b) => {
      const ca = countMap.get(a.id) ?? 0;
      const cb = countMap.get(b.id) ?? 0;
      if (ca !== cb) return ca - cb;
      return a.id - b.id;
    });

    return sorted[0];
  } catch (err) {
    console.error("[lead-router] pickAgentForLead failed:", err);
    return null;
  }
}
