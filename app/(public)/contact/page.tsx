import { Metadata } from "next";
import ContactForm from "@/components/layout/ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — Leo Realty Capital Investments",
  description:
    "Contact Leo Realty Capital Investments. Call, email, or visit our North Miami Beach office. We're available Monday–Friday 9am–5pm.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A1628] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-[#C5A55A]/20 border border-[#C5A55A]/40 rounded-full px-4 py-2 mb-6">
            <span className="text-[#C5A55A] text-sm font-medium">Get In Touch</span>
          </div>
          <h1 className="text-5xl font-bold text-white font-[var(--font-playfair)] mb-4">
            Contact Leo Realty
          </h1>
          <p className="text-white/70 text-xl max-w-xl">
            Ready to start your real estate journey? Our team of experts is here
            to help. Reach out today for a free consultation.
          </p>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-24 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-8">
                Get In Touch
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#C5A55A]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1628] mb-1">Office Address</div>
                    <div className="text-gray-600">
                      909 North Miami Beach Blvd<br />
                      Suite 301A<br />
                      North Miami Beach, FL
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#C5A55A]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1628] mb-1">Phone</div>
                    <a href="tel:+13057052030" className="text-gray-600 hover:text-[#C5A55A] transition-colors">
                      (305) 705-2030
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#C5A55A]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1628] mb-1">Email</div>
                    <a
                      href="mailto:Info@leorealtycapitalinvestments.com"
                      className="text-gray-600 hover:text-[#C5A55A] transition-colors break-all"
                    >
                      Info@leorealtycapitalinvestments.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#C5A55A]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1628] mb-1">Office Hours</div>
                    <div className="text-gray-600">
                      Monday – Friday<br />
                      9:00 AM – 5:00 PM
                    </div>
                  </div>
                </div>
              </div>

              {/* Map embed placeholder */}
              <div className="mt-8 rounded-2xl overflow-hidden bg-[#0A1628]/5 h-48 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">909 N Miami Beach Blvd, Suite 301A</p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
