// Device-local listing reactions ("interested / loved / will contact").
// No login: reactions live in localStorage instantly; claiming by email
// (magic link) mirrors them server-side and keeps them synced afterwards.

export type Reaction = "interested" | "loved" | "will_contact";

export type ReactionEntry = {
  reaction: Reaction;
  address: string | null;
  price: number | null;
  city: string | null;
  at: number;
};

export type ReactionMap = Record<string, ReactionEntry>;

const STORE_KEY = "leo:reactions";
const CLAIM_KEY = "leo:reactions:claim";
export const REACTIONS_CHANGED_EVENT = "leo:reactions-changed";

export const REACTION_ORDER: Reaction[] = ["will_contact", "loved", "interested"];

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getReactions(): ReactionMap {
  if (typeof window === "undefined") return {};
  return safeParse<ReactionMap>(window.localStorage.getItem(STORE_KEY), {});
}

export function getClaim(): { email: string; token: string } | null {
  if (typeof window === "undefined") return null;
  return safeParse<{ email: string; token: string } | null>(
    window.localStorage.getItem(CLAIM_KEY),
    null
  );
}

export function setClaim(claim: { email: string; token: string } | null): void {
  if (typeof window === "undefined") return;
  if (claim) window.localStorage.setItem(CLAIM_KEY, JSON.stringify(claim));
  else window.localStorage.removeItem(CLAIM_KEY);
}

function persist(map: ReactionMap): void {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(map));
  } catch {
    // Private-mode quota: reactions stay in-memory for this page only.
  }
  window.dispatchEvent(new CustomEvent(REACTIONS_CHANGED_EVENT));
}

/** Fire-and-forget server sync once the visitor has claimed their list. */
function syncClaimed(upserts: Array<{ listingKey: string } & ReactionEntry>, removes: string[]): void {
  const claim = getClaim();
  if (!claim) return;
  fetch("/api/reactions/sync", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: claim.email,
      token: claim.token,
      upserts: upserts.map((u) => ({
        listingKey: u.listingKey,
        reaction: u.reaction,
        address: u.address,
        price: u.price,
        city: u.city,
      })),
      removes,
    }),
  }).catch(() => {
    // Non-fatal: local copy is the source of truth until the next sync.
  });
}

export function setReaction(listingKey: string, entry: Omit<ReactionEntry, "at"> | null): void {
  if (typeof window === "undefined") return;
  const map = getReactions();
  if (entry) {
    const full: ReactionEntry = { ...entry, at: Date.now() };
    map[listingKey] = full;
    persist(map);
    syncClaimed([{ listingKey, ...full }], []);
  } else {
    delete map[listingKey];
    persist(map);
    syncClaimed([], [listingKey]);
  }
}

export function reactionCount(): number {
  return Object.keys(getReactions()).length;
}
