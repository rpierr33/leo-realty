import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Leo Realty Capital Investments Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#F8F7F4] pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[#C5A55A] text-sm font-semibold">Legal</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-10">Last updated: January 1, 2024</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed">Leo Realty Capital Investments collects information you provide when contacting us, requesting information, or using our website. This includes name, email address, phone number, and property preferences.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed">We use collected information to respond to inquiries, provide real estate services, send relevant property listings, and improve our services. We do not sell or rent your personal information to third parties.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">3. Information Security</h2>
              <p className="text-gray-600 leading-relaxed">We implement industry-standard security measures to protect your personal information. All data is transmitted securely and stored with appropriate safeguards.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">4. Cookies</h2>
              <p className="text-gray-600 leading-relaxed">Our website may use cookies to improve your browsing experience. You can disable cookies in your browser settings, though some site features may be affected.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">5. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">For privacy-related inquiries, contact us at Info@leorealtycapitalinvestments.com or call (305) 705-2030.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
