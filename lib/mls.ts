const API_BASE = process.env.MLS_API_BASE ?? "https://api.bridgedataoutput.com/api/v2";
const DATASET = process.env.MLS_DATASET ?? "test";
const SERVER_TOKEN = process.env.MLS_SERVER_TOKEN ?? "";

export interface MlsListing {
  listingKey: string;
  listingId: string | null;
  status: string | null;
  listPrice: number | null;
  unparsedAddress: string | null;
  city: string | null;
  stateOrProvince: string | null;
  postalCode: string | null;
  bedrooms: number | null;
  bathroomsTotal: number | null;
  livingArea: number | null;
  livingAreaUnits: string | null;
  lotSizeAcres: number | null;
  yearBuilt: number | null;
  propertyType: string | null;
  propertySubType: string | null;
  publicRemarks: string | null;
  photos: Array<{ url: string; order: number; description: string | null }>;
  modifiedAt: string | null;
  daysOnMarket: number | null;
  listingAgentName: string | null;
  listingOfficeName: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface BridgeProperty {
  ListingKey: string;
  ListingId: string | null;
  StandardStatus: string | null;
  ListPrice: number | null;
  UnparsedAddress: string | null;
  City: string | null;
  StateOrProvince: string | null;
  PostalCode: string | null;
  BedroomsTotal: number | null;
  BathroomsTotalDecimal: number | null;
  BathroomsTotalInteger: number | null;
  LivingArea: number | null;
  LivingAreaUnits: string | null;
  LotSizeAcres: number | null;
  YearBuilt: number | null;
  PropertyType: string | null;
  PropertySubType: string | null;
  PublicRemarks: string | null;
  Media: Array<{
    MediaURL: string;
    Order: number;
    ShortDescription: string | null;
  }> | null;
  ModificationTimestamp: string | null;
  DaysOnMarket: number | null;
  ListAgentFullName: string | null;
  ListOfficeName: string | null;
  Latitude: number | null;
  Longitude: number | null;
}

interface BridgeResponse {
  value: BridgeProperty[];
  "@odata.count"?: number;
  "@odata.nextLink"?: string;
}

function mapBridge(p: BridgeProperty): MlsListing {
  return {
    listingKey: p.ListingKey,
    listingId: p.ListingId,
    status: p.StandardStatus,
    listPrice: p.ListPrice,
    unparsedAddress: p.UnparsedAddress,
    city: p.City,
    stateOrProvince: p.StateOrProvince,
    postalCode: p.PostalCode,
    bedrooms: p.BedroomsTotal,
    bathroomsTotal: p.BathroomsTotalDecimal ?? p.BathroomsTotalInteger,
    livingArea: p.LivingArea,
    livingAreaUnits: p.LivingAreaUnits,
    lotSizeAcres: p.LotSizeAcres,
    yearBuilt: p.YearBuilt,
    propertyType: p.PropertyType,
    propertySubType: p.PropertySubType,
    publicRemarks: p.PublicRemarks,
    photos: (p.Media ?? [])
      .map((m) => ({ url: m.MediaURL, order: m.Order, description: m.ShortDescription }))
      .sort((a, b) => a.order - b.order),
    modifiedAt: p.ModificationTimestamp,
    daysOnMarket: p.DaysOnMarket,
    listingAgentName: p.ListAgentFullName,
    listingOfficeName: p.ListOfficeName,
    latitude: p.Latitude,
    longitude: p.Longitude,
  };
}

export interface SearchParams {
  status?: string;
  city?: string;
  stateOrProvince?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  propertyType?: string;
  q?: string;
  top?: number;
  skip?: number;
}

function buildFilter(params: SearchParams): string {
  const clauses: string[] = [];

  if (params.status) clauses.push(`StandardStatus eq '${escapeOData(params.status)}'`);
  else clauses.push("StandardStatus eq 'Active'");

  if (params.city) clauses.push(`City eq '${escapeOData(params.city)}'`);
  if (params.stateOrProvince) clauses.push(`StateOrProvince eq '${escapeOData(params.stateOrProvince)}'`);
  if (params.minPrice !== undefined) clauses.push(`ListPrice ge ${params.minPrice}`);
  if (params.maxPrice !== undefined) clauses.push(`ListPrice le ${params.maxPrice}`);
  if (params.minBeds !== undefined) clauses.push(`BedroomsTotal ge ${params.minBeds}`);
  if (params.minBaths !== undefined) clauses.push(`BathroomsTotalDecimal ge ${params.minBaths}`);
  if (params.propertyType) clauses.push(`PropertyType eq '${escapeOData(params.propertyType)}'`);

  if (params.q && params.q.trim()) {
    const term = escapeOData(params.q.trim());
    clauses.push(
      `(contains(City, '${term}') or contains(UnparsedAddress, '${term}') or contains(PostalCode, '${term}'))`
    );
  }

  return clauses.join(" and ");
}

function escapeOData(value: string): string {
  return value.replace(/'/g, "''");
}

export async function searchProperties(params: SearchParams = {}): Promise<{
  listings: MlsListing[];
  total: number;
}> {
  if (!SERVER_TOKEN) {
    throw new Error("MLS_SERVER_TOKEN is not configured");
  }

  const filter = buildFilter(params);
  const top = Math.min(params.top ?? 24, 200);
  const skip = params.skip ?? 0;

  const url = new URL(`${API_BASE}/OData/${DATASET}/Property`);
  url.searchParams.set("access_token", SERVER_TOKEN);
  url.searchParams.set("$filter", filter);
  url.searchParams.set("$top", String(top));
  url.searchParams.set("$skip", String(skip));
  url.searchParams.set("$count", "true");
  url.searchParams.set("$orderby", "ModificationTimestamp desc");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Bridge API error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data: BridgeResponse = await res.json();
  return {
    listings: data.value.map(mapBridge),
    total: data["@odata.count"] ?? data.value.length,
  };
}

export async function getProperty(listingKey: string): Promise<MlsListing | null> {
  if (!SERVER_TOKEN) {
    throw new Error("MLS_SERVER_TOKEN is not configured");
  }

  const url = new URL(`${API_BASE}/OData/${DATASET}/Property('${encodeURIComponent(listingKey)}')`);
  url.searchParams.set("access_token", SERVER_TOKEN);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Bridge API error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data: BridgeProperty = await res.json();
  return mapBridge(data);
}

export function formatPriceUSD(value: number | null): string {
  if (value === null || value === undefined) return "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatStatus(status: string | null): string {
  if (!status) return "—";
  return status.replace(/([A-Z])/g, " $1").trim();
}
