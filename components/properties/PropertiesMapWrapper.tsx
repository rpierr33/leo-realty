"use client";

import dynamic from "next/dynamic";
import type { MapListing } from "./PropertiesMap";

const PropertiesMap = dynamic(() => import("./PropertiesMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-200px)] min-h-[500px] rounded-2xl bg-white border border-[#E8E4DE] flex items-center justify-center">
      <div className="text-[#6B7280] text-sm">Loading map…</div>
    </div>
  ),
});

export default function PropertiesMapWrapper({ listings }: { listings: MapListing[] }) {
  return <PropertiesMap listings={listings} />;
}
