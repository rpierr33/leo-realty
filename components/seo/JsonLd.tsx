const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://leorealtycapitalinvestments.com";

const NAP = {
  name: "Leo Realty Capital Investments",
  legalName: "Leo Realty Capital Investments",
  alternateName: "Leo Realty",
  streetAddress: "909 North Miami Beach Blvd, Suite 301A",
  addressLocality: "North Miami Beach",
  addressRegion: "FL",
  postalCode: "33162",
  addressCountry: "US",
  telephone: "+1-305-705-2030",
  email: "Info@leorealtycapitalinvestments.com",
  latitude: 25.9331,
  longitude: -80.1628,
  foundingDate: "1992",
  founder: "Leopold Evariste",
};

function safeJsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "@id": `${SITE_URL}#organization`,
  name: NAP.name,
  legalName: NAP.legalName,
  alternateName: NAP.alternateName,
  url: SITE_URL,
  logo: `${SITE_URL}/leo-logo.png`,
  image: `${SITE_URL}/leopold-hero.jpg`,
  telephone: NAP.telephone,
  email: NAP.email,
  foundingDate: NAP.foundingDate,
  founder: { "@type": "Person", name: NAP.founder },
  address: {
    "@type": "PostalAddress",
    streetAddress: NAP.streetAddress,
    addressLocality: NAP.addressLocality,
    addressRegion: NAP.addressRegion,
    postalCode: NAP.postalCode,
    addressCountry: NAP.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: NAP.latitude,
    longitude: NAP.longitude,
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Miami-Dade County, Florida" },
    { "@type": "AdministrativeArea", name: "Broward County, Florida" },
    { "@type": "AdministrativeArea", name: "Palm Beach County, Florida" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  knowsLanguage: ["en", "fr", "ht"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Real Estate Services",
    itemListElement: [
      { "@type": "Offer", name: "Home Buying", description: "Full-service home buying with MLS access and expert negotiation." },
      { "@type": "Offer", name: "Home Selling - MR 2% Commission", description: "Sell your home with the exclusive MR 2% flat commission model. Half the industry standard." },
      { "@type": "Offer", name: "Rentals", description: "Residential, commercial, and multi-family rentals across South Florida." },
      { "@type": "Offer", name: "Mortgage Financing", description: "Mortgage programs via KLE Mortgage Financing, LLC (NMLS 2380070): FHA, VA, USDA, Conventional, DSCR, Hometown Heroes." },
    ],
  },
  sameAs: [],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "100",
    bestRating: "5",
    worstRating: "1",
  },
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  url: SITE_URL,
  name: NAP.name,
  publisher: { "@id": `${SITE_URL}#organization` },
  inLanguage: ["en", "fr", "ht"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/properties?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: safeJsonForScript([ORG_SCHEMA, WEBSITE_SCHEMA]),
      }}
    />
  );
}

type FaqItem = { question: string; answer: string };

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeJsonForScript(schema) }}
    />
  );
}

type BreadcrumbItem = { name: string; url: string };

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeJsonForScript(schema) }}
    />
  );
}
