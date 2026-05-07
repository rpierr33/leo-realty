// Neighborhoods Leo Realty serves across South Florida.
// Used for programmatic landing pages at /neighborhoods/[slug].
// Each neighborhood targets long-tail SEO ("homes for sale [city]")
// and gives AI engines structured local content to cite.

export type Neighborhood = {
  slug: string;
  name: string;
  county: string;
  state: "FL";
  description: string;
  vibe: string;
  highlights: string[];
  zipCodes: string[];
  // Approximate center coordinates for LocalBusiness/Place schema
  lat: number;
  lng: number;
};

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "north-miami-beach",
    name: "North Miami Beach",
    county: "Miami-Dade County",
    state: "FL",
    description:
      "Leo Realty's home base. North Miami Beach offers a mix of single-family homes, condos, and waterfront properties at more accessible price points than coastal Miami Beach. Strong rental demand, established communities, and easy access to I-95 and the Turnpike make it popular with families and investors alike.",
    vibe: "Established, family-friendly, multicultural — strong Haitian, Latin American, and Caribbean populations.",
    highlights: [
      "Greynolds Park and Oleta River State Park within minutes",
      "Diverse dining — Caribbean, Haitian, Cuban, kosher",
      "Direct access to Aventura, Sunny Isles, and Miami Gardens",
      "Mix of condos under $300K and single-family homes $500K-$1.5M",
    ],
    zipCodes: ["33162", "33179", "33169", "33181"],
    lat: 25.9331,
    lng: -80.1628,
  },
  {
    slug: "miami-beach",
    name: "Miami Beach",
    county: "Miami-Dade County",
    state: "FL",
    description:
      "Miami Beach offers world-renowned beaches, Art Deco architecture, and one of the most coveted real estate markets in the United States. From historic South Beach condos to luxury oceanfront estates in Mid-Beach and North Beach, Miami Beach properties span every price point above $400K.",
    vibe: "Iconic, international, walkable — a 24/7 lifestyle destination.",
    highlights: [
      "South Beach Art Deco Historic District",
      "Lincoln Road pedestrian shopping",
      "Direct ocean access from many condos",
      "Strong short-term rental potential (where allowed)",
    ],
    zipCodes: ["33139", "33140", "33141"],
    lat: 25.7907,
    lng: -80.13,
  },
  {
    slug: "brickell",
    name: "Brickell",
    county: "Miami-Dade County",
    state: "FL",
    description:
      "Miami's financial district and skyline. Brickell offers high-rise condo living with skyline and Biscayne Bay views, walkable urbanism, and direct connections to downtown Miami. Popular with young professionals, international buyers, and rental investors. Price points span $400K studios to $5M+ penthouses.",
    vibe: "Urban, professional, vertical living — Miami's Manhattan.",
    highlights: [
      "Brickell City Centre shopping",
      "Walking distance to Downtown Miami employers",
      "Metromover and Metrorail access",
      "Strong rental demand from financial-sector workers",
    ],
    zipCodes: ["33129", "33130", "33131"],
    lat: 25.7617,
    lng: -80.1918,
  },
  {
    slug: "aventura",
    name: "Aventura",
    county: "Miami-Dade County",
    state: "FL",
    description:
      "Aventura combines luxury condo living, master-planned communities, and the namesake Aventura Mall — one of the largest in the United States. Top-rated Aventura Charter School District. Heavy international buyer presence, particularly from South America. Condos from $300K, single-family homes $700K-$5M+.",
    vibe: "Upscale, international, master-planned — gated and HOA-driven.",
    highlights: [
      "Aventura Mall (one of the top US shopping destinations)",
      "Aventura City of Excellence School (charter)",
      "Marina and golf communities",
      "5 minutes to Sunny Isles beaches and 10 to FLL airport",
    ],
    zipCodes: ["33160", "33180"],
    lat: 25.9565,
    lng: -80.1392,
  },
  {
    slug: "coral-gables",
    name: "Coral Gables",
    county: "Miami-Dade County",
    state: "FL",
    description:
      "Coral Gables is Miami-Dade's premier historic and architectural district. Tree-lined boulevards, Mediterranean Revival homes, top private schools, and a walkable Miracle Mile shopping district. Home to the University of Miami. Single-family homes $1M-$10M+ in the heart, $700K+ at the edges.",
    vibe: "Historic, architectural, prestigious — the 'City Beautiful'.",
    highlights: [
      "Miracle Mile & Giralda Plaza",
      "Venetian Pool and Coral Gables Country Club",
      "University of Miami within walking distance for many homes",
      "Top-rated public and private schools",
    ],
    zipCodes: ["33134", "33143", "33146"],
    lat: 25.7215,
    lng: -80.2683,
  },
  {
    slug: "doral",
    name: "Doral",
    county: "Miami-Dade County",
    state: "FL",
    description:
      "Doral is one of South Florida's fastest-growing cities, popular with families and corporate relocations. Master-planned communities, strong public schools, golf-course homes (Trump National Doral), and easy access to MIA airport make it a top pick for international buyers from Latin America. Townhomes from $500K, single-family $700K-$3M.",
    vibe: "Family, corporate, master-planned — South Florida's growth engine.",
    highlights: [
      "Trump National Doral Miami golf course",
      "Top-rated Doral Charter Elementary",
      "5 minutes to Miami International Airport",
      "Heavy Venezuelan, Colombian, and Brazilian populations",
    ],
    zipCodes: ["33122", "33172", "33178", "33182"],
    lat: 25.8195,
    lng: -80.3553,
  },
  {
    slug: "hollywood",
    name: "Hollywood",
    county: "Broward County",
    state: "FL",
    description:
      "Hollywood, Florida offers waterfront living without the Miami Beach price tag. The famous Hollywood Beach Broadwalk, an authentic Florida main-street downtown, and a mix of mid-century homes, intracoastal-front condos, and gated communities like Emerald Hills. Single-family $400K-$1.5M, condos $200K+.",
    vibe: "Beachy, laid-back, working-family Florida — quintessential coastal living.",
    highlights: [
      "Hollywood Beach Broadwalk (2.5-mile beachfront promenade)",
      "ArtsPark at Young Circle",
      "Direct access to FLL airport",
      "Strong short-term rental market on the beach",
    ],
    zipCodes: ["33019", "33020", "33021"],
    lat: 26.0112,
    lng: -80.1495,
  },
  {
    slug: "pembroke-pines",
    name: "Pembroke Pines",
    county: "Broward County",
    state: "FL",
    description:
      "Pembroke Pines is South Florida's family-suburban heartland. Top-rated public schools, large master-planned communities, plenty of parks, and accessible price points make it the most popular Broward city for first-time buyers and families relocating from elsewhere. Single-family $450K-$900K, townhomes $350K-$550K.",
    vibe: "Suburban, family-first, school-district-driven.",
    highlights: [
      "C.B. Smith Park and Pembroke Pines Park system",
      "Top-rated public schools (Charter Schools at Pembroke Pines)",
      "Walmart and Pembroke Lakes Mall",
      "Easy I-75 access to Miami and Fort Lauderdale",
    ],
    zipCodes: ["33024", "33025", "33027", "33028", "33029"],
    lat: 26.0086,
    lng: -80.2962,
  },
];

export function getNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.slug === slug);
}
