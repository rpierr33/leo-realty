const API_BASE = process.env.MLS_API_BASE ?? "https://api.bridgedataoutput.com/api/v2";
const DATASET = process.env.MLS_DATASET ?? "test";
const SERVER_TOKEN = process.env.MLS_SERVER_TOKEN ?? "";

export interface MlsListing {
  listingKey: string;
  listingId: string | null;
  status: string | null;
  mlsStatus: string | null;
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
  isLease: boolean;
  poolPrivate: boolean | null;
  waterfront: boolean | null;
  garageSpaces: number | null;
  carportSpaces: number | null;
}

interface BridgeProperty {
  ListingKey: string;
  ListingId: string | null;
  StandardStatus: string | null;
  MlsStatus: string | null;
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
  Media: Array<{ MediaURL: string; Order: number; ShortDescription: string | null }> | null;
  ModificationTimestamp: string | null;
  DaysOnMarket: number | null;
  ListAgentFullName: string | null;
  ListOfficeName: string | null;
  Latitude: number | null;
  Longitude: number | null;
  PoolPrivateYN: boolean | null;
  WaterfrontYN: boolean | null;
  GarageSpaces: number | null;
  CarportSpaces: number | null;
}

interface BridgeResponse {
  value: BridgeProperty[];
  "@odata.count"?: number;
  "@odata.nextLink"?: string;
}

const LEASE_PROPERTY_TYPES = new Set(["Residential Lease", "Commercial Lease"]);

function mapBridge(p: BridgeProperty): MlsListing {
  const propertyType = p.PropertyType;
  return {
    listingKey: p.ListingKey,
    listingId: p.ListingId,
    status: p.StandardStatus,
    mlsStatus: p.MlsStatus,
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
    propertyType,
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
    isLease: propertyType ? LEASE_PROPERTY_TYPES.has(propertyType) : false,
    poolPrivate: p.PoolPrivateYN,
    waterfront: p.WaterfrontYN,
    garageSpaces: p.GarageSpaces,
    carportSpaces: p.CarportSpaces,
  };
}

// UI sort key → OData $orderby value
const SORT_MAP: Record<string, string> = {
  newest: "ModificationTimestamp desc",
  oldest: "ModificationTimestamp asc",
  price_asc: "ListPrice asc",
  price_desc: "ListPrice desc",
  sqft_desc: "LivingArea desc",
  beds_desc: "BedroomsTotal desc",
};

// UI property-type key → MIAMIRE PropertyType (and optionally PropertySubType filter)
// PropertyType values seen in feed: Residential | Residential Lease | Residential Income |
// Commercial Sale | Commercial Land | Land/Boat Docks | Business Opportunity
// PropertySubType: Single Family Residence | Condominium | Townhouse | Villa | Multi Family |
// Duplex | Apartment | Office | Retail | Industrial | Restaurant/Entertainment | Mobile Home
export interface PropertyTypeMapping {
  propertyTypes: string[]; // PropertyType in (…)
  propertySubTypes?: string[]; // optional PropertySubType in (…)
}

export const PROPERTY_TYPE_MAP: Record<string, PropertyTypeMapping> = {
  residential: { propertyTypes: ["Residential", "Residential Lease"] },
  single_family: { propertyTypes: ["Residential", "Residential Lease"], propertySubTypes: ["Single Family Residence"] },
  condo: { propertyTypes: ["Residential", "Residential Lease"], propertySubTypes: ["Condominium"] },
  townhouse: { propertyTypes: ["Residential", "Residential Lease"], propertySubTypes: ["Townhouse"] },
  villa: { propertyTypes: ["Residential", "Residential Lease"], propertySubTypes: ["Villa"] },
  multi_family: {
    propertyTypes: ["Residential Income", "Residential", "Residential Lease"],
    propertySubTypes: ["Multi Family", "Duplex", "Apartment"],
  },
  investment: { propertyTypes: ["Residential Income"] },
  commercial: { propertyTypes: ["Commercial Sale"] },
  land: { propertyTypes: ["Land/Boat Docks", "Commercial Land"] },
};

export type StatusBucket = "for_sale" | "for_rent" | "pending" | "sold" | "rented" | "all";

export interface StatusFilter {
  statuses?: string[]; // StandardStatus in (…)
  propertyTypes?: string[]; // PropertyType in (…)
  notPropertyTypes?: string[]; // exclude leases from sale, etc.
  mlsStatuses?: string[]; // MlsStatus in (…)
}

export function statusBucketToFilter(bucket: StatusBucket | undefined): StatusFilter {
  if (!bucket || bucket === "all") return { statuses: ["Active", "ActiveUnderContract"] };
  if (bucket === "for_sale") {
    return {
      statuses: ["Active", "ActiveUnderContract"],
      notPropertyTypes: ["Residential Lease", "Commercial Lease"],
    };
  }
  if (bucket === "for_rent") {
    return {
      statuses: ["Active", "ActiveUnderContract"],
      propertyTypes: ["Residential Lease", "Commercial Lease"],
    };
  }
  if (bucket === "pending") return { statuses: ["Pending"] };
  if (bucket === "sold") {
    return { statuses: ["Closed"], notPropertyTypes: ["Residential Lease", "Commercial Lease"] };
  }
  if (bucket === "rented") {
    return { statuses: ["Closed"], propertyTypes: ["Residential Lease", "Commercial Lease"] };
  }
  return { statuses: ["Active", "ActiveUnderContract"] };
}

export interface SearchParams {
  statusBucket?: StatusBucket;
  propertyTypeKey?: string; // key into PROPERTY_TYPE_MAP
  city?: string;
  stateOrProvince?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  minSqft?: number;
  minYearBuilt?: number;
  pool?: boolean;
  waterfront?: boolean;
  garage?: boolean;
  q?: string;
  sort?: string;
  top?: number;
  skip?: number;
}

function escapeOData(value: string): string {
  return value.replace(/'/g, "''");
}

function inClause(field: string, values: string[]): string {
  return `(${values.map((v) => `${field} eq '${escapeOData(v)}'`).join(" or ")})`;
}

function notInClause(field: string, values: string[]): string {
  return `(${values.map((v) => `${field} ne '${escapeOData(v)}'`).join(" and ")})`;
}

function buildFilter(params: SearchParams): string {
  const clauses: string[] = [];

  const statusFilter = statusBucketToFilter(params.statusBucket);
  if (statusFilter.statuses && statusFilter.statuses.length) {
    clauses.push(inClause("StandardStatus", statusFilter.statuses));
  }
  if (statusFilter.mlsStatuses && statusFilter.mlsStatuses.length) {
    clauses.push(inClause("MlsStatus", statusFilter.mlsStatuses));
  }

  // Property-type narrowing from UI dropdown
  const typeMap = params.propertyTypeKey ? PROPERTY_TYPE_MAP[params.propertyTypeKey] : undefined;
  let appliedPropertyTypes: string[] | undefined = typeMap?.propertyTypes;
  if (statusFilter.propertyTypes && statusFilter.propertyTypes.length) {
    // status forces a property type set; intersect with UI's set if any
    if (appliedPropertyTypes && appliedPropertyTypes.length) {
      const intersection = appliedPropertyTypes.filter((t) => statusFilter.propertyTypes!.includes(t));
      appliedPropertyTypes = intersection.length ? intersection : statusFilter.propertyTypes;
    } else {
      appliedPropertyTypes = statusFilter.propertyTypes;
    }
  }
  if (appliedPropertyTypes && appliedPropertyTypes.length) {
    clauses.push(inClause("PropertyType", appliedPropertyTypes));
  }
  if (statusFilter.notPropertyTypes && statusFilter.notPropertyTypes.length) {
    clauses.push(notInClause("PropertyType", statusFilter.notPropertyTypes));
  }
  if (typeMap?.propertySubTypes && typeMap.propertySubTypes.length) {
    clauses.push(inClause("PropertySubType", typeMap.propertySubTypes));
  }

  if (params.city) clauses.push(`City eq '${escapeOData(params.city)}'`);
  if (params.stateOrProvince) clauses.push(`StateOrProvince eq '${escapeOData(params.stateOrProvince)}'`);
  if (params.minPrice !== undefined) clauses.push(`ListPrice ge ${params.minPrice}`);
  if (params.maxPrice !== undefined) clauses.push(`ListPrice le ${params.maxPrice}`);
  if (params.minBeds !== undefined) clauses.push(`BedroomsTotal ge ${params.minBeds}`);
  if (params.minBaths !== undefined) clauses.push(`BathroomsTotalDecimal ge ${params.minBaths}`);
  if (params.minSqft !== undefined) clauses.push(`LivingArea ge ${params.minSqft}`);
  if (params.minYearBuilt !== undefined) clauses.push(`YearBuilt ge ${params.minYearBuilt}`);
  if (params.pool) clauses.push(`PoolPrivateYN eq true`);
  if (params.waterfront) clauses.push(`WaterfrontYN eq true`);
  if (params.garage) clauses.push(`GarageSpaces ge 1`);

  if (params.q && params.q.trim()) {
    const term = escapeOData(params.q.trim());
    clauses.push(
      `(contains(City, '${term}') or contains(UnparsedAddress, '${term}') or contains(PostalCode, '${term}') or contains(SubdivisionName, '${term}'))`
    );
  }

  return clauses.join(" and ");
}

const SELECT_FIELDS = [
  "ListingKey",
  "ListingId",
  "StandardStatus",
  "MlsStatus",
  "ListPrice",
  "UnparsedAddress",
  "City",
  "StateOrProvince",
  "PostalCode",
  "BedroomsTotal",
  "BathroomsTotalDecimal",
  "BathroomsTotalInteger",
  "LivingArea",
  "LivingAreaUnits",
  "LotSizeAcres",
  "YearBuilt",
  "PropertyType",
  "PropertySubType",
  "PublicRemarks",
  "Media",
  "ModificationTimestamp",
  "DaysOnMarket",
  "ListAgentFullName",
  "ListOfficeName",
  "Latitude",
  "Longitude",
  "PoolPrivateYN",
  "WaterfrontYN",
  "GarageSpaces",
  "CarportSpaces",
].join(",");

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
  const orderby = SORT_MAP[params.sort ?? "newest"] ?? SORT_MAP.newest;

  const url = new URL(`${API_BASE}/OData/${DATASET}/Property`);
  url.searchParams.set("access_token", SERVER_TOKEN);
  url.searchParams.set("$filter", filter);
  url.searchParams.set("$select", SELECT_FIELDS);
  url.searchParams.set("$top", String(top));
  url.searchParams.set("$skip", String(skip));
  url.searchParams.set("$count", "true");
  url.searchParams.set("$orderby", orderby);

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
  if (!SERVER_TOKEN) throw new Error("MLS_SERVER_TOKEN is not configured");

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

export function formatPriceUSD(value: number | null, isLease: boolean = false): string {
  if (value === null || value === undefined) return "Price on request";
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
  return isLease ? `${formatted}/mo` : formatted;
}

export function formatStatus(status: string | null): string {
  if (!status) return "—";
  return status.replace(/([A-Z])/g, " $1").trim();
}

/**
 * Derive the user-facing status label from a listing.
 * Active+Lease → "For Rent", Active+sale → "For Sale", Closed+Lease → "Rented", Closed → "Sold", etc.
 */
export function deriveListingLabel(listing: MlsListing): string {
  const status = listing.status;
  if (listing.isLease) {
    if (status === "Active" || status === "ActiveUnderContract") return "For Rent";
    if (status === "Pending") return "Pending";
    if (status === "Closed") return "Rented";
    return status ?? "Lease";
  }
  if (status === "Active") return "For Sale";
  if (status === "ActiveUnderContract") return "Under Contract";
  if (status === "Pending") return "Pending";
  if (status === "Closed") return "Sold";
  if (status === "Withdrawn") return "Withdrawn";
  if (status === "Expired") return "Expired";
  if (status === "Canceled") return "Canceled";
  return status ?? "Available";
}
