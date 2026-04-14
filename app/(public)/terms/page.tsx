import { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service", description: "Leo Realty Capital Investments Terms of Service" };

export default function TermsPage() {
  return (
    <div className="bg-[#F8F7F4] pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[#C5A55A] text-sm font-semibold">Legal</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-2">Terms of Service</h1>
          <p className="text-gray-400 text-sm mb-10">Last updated: January 1, 2024</p>
          <div className="space-y-8">
            {[
              { title: "1. Acceptance of Terms", body: "By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website." },
              { title: "2. Use of Website", body: "This website is provided for informational purposes about Leo Realty Capital Investments services. You agree to use this site lawfully and not to transmit any harmful, offensive, or disruptive content." },
              { title: "3. Property Listings", body: "Property information displayed on this website is believed to be accurate but is not guaranteed. Prices, availability, and details are subject to change. Contact us directly to verify current information." },
              { title: "4. Intellectual Property", body: "All content on this website, including text, images, logos, and design, is the property of Leo Realty Capital Investments and is protected by copyright law." },
              { title: "5. Limitation of Liability", body: "Leo Realty Capital Investments is not liable for any damages arising from your use of this website or reliance on information provided herein." },
            ].map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
