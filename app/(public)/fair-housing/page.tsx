import { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = { title: "Fair Housing Statement", description: "Leo Realty Capital Investments Fair Housing Policy" };

export default function FairHousingPage() {
  return (
    <div className="bg-[#F8F7F4] pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-[#0A1628] flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-[#C5A55A]" />
          </div>
          <h1 className="text-4xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-4">Fair Housing Statement</h1>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="text-xl text-[#0A1628] font-semibold">
              Leo Realty Capital Investments is committed to the principles of the Fair Housing Act.
            </p>
            <p>
              We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the nation. We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, color, religion, sex, handicap, familial status, or national origin.
            </p>
            <p>
              Leo Realty Capital Investments and all its associates do not discriminate in the provision of or in the access to housing, financing, or related transactions on the basis of race, color, religion, sex, handicap, familial status, national origin, ancestry, or any other class protected by federal, state or local law.
            </p>
            <div className="bg-[#0A1628] text-white rounded-2xl p-6">
              <h2 className="text-lg font-bold font-[var(--font-playfair)] mb-3 text-[#C5A55A]">Your Rights Under Fair Housing</h2>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• The right to choose housing free from unlawful discrimination</li>
                <li>• Equal and fair treatment in all housing transactions</li>
                <li>• Reasonable accommodations for persons with disabilities</li>
                <li>• Protection from steering, blockbusting, and redlining</li>
                <li>• The right to file a complaint if you believe discrimination has occurred</li>
              </ul>
            </div>
            <p>
              If you believe you have been discriminated against in a real estate transaction, contact the U.S. Department of Housing and Urban Development (HUD) at (800) 669-9777 or visit hud.gov/fairhousing.
            </p>
            <p className="text-sm text-gray-400">
              For questions about our fair housing practices, contact us at Info@leorealtycapitalinvestments.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
