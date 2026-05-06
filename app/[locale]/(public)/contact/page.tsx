import ContactForm from "@/components/layout/ContactForm";
import { Phone, Mail, MapPin, Clock, Star } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("Contact");

  const contactItems = [
    { icon: MapPin, label: t("officeAddress"), content: "909 North Miami Beach Blvd\nSuite 301A\nNorth Miami Beach, FL", isMultiLine: true },
    { icon: Phone, label: t("phone"), content: "(305) 705-2030", href: "tel:+13057052030" },
    { icon: Mail, label: t("email"), content: "Info@leorealtycapitalinvestments.com", href: "mailto:Info@leorealtycapitalinvestments.com" },
    { icon: Clock, label: t("officeHours"), content: t("officeHoursValue"), isMultiLine: true },
  ];

  const stats = [
    { value: "32+", label: t("yearsExperience") },
    { value: "MR 2%", label: t("commission") },
    { value: "1,000+", label: t("homesClosed") },
    { value: "6", label: t("experts") },
  ];

  return (
    <>
      <section className="relative bg-[#0A1628] pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] to-[#0A1628]/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <span className="section-label">{t("label")}</span>
          <h1 className="font-playfair text-[clamp(2.8rem,6vw,5rem)] font-bold text-white leading-tight mb-5">
            {t("title")}
          </h1>
          <p className="text-white/60 text-xl max-w-xl leading-relaxed">{t("subcopy")}</p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-playfair text-2xl font-bold text-[#0A1628] mb-8">
                {t("officeInfoTitle")}
              </h2>

              <div className="space-y-6 mb-8">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#C5A55A]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0A1628] text-sm mb-1">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-[#6B7280] text-sm hover:text-[#C5A55A] transition-colors break-all">
                          {item.content}
                        </a>
                      ) : (
                        <div className="text-[#6B7280] text-sm whitespace-pre-line">{item.content}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden bg-[#0A1628]/5 h-48 flex items-center justify-center border border-[#E8E4DE]">
                <div className="text-center text-[#6B7280]">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-[#C5A55A]/50" />
                  <p className="text-sm font-medium">909 N Miami Beach Blvd</p>
                  <p className="text-xs text-[#6B7280]/60 mt-1">Suite 301A, North Miami Beach</p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-[#0A1628] rounded-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <div className="font-playfair text-2xl font-bold text-[#C5A55A]">{s.value}</div>
                      <div className="text-white/40 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-[#0A1628] rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#C5A55A]/15 flex items-center justify-center">
                  <span className="font-playfair text-[#C5A55A] font-bold text-sm">J</span>
                </div>
                <div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C5A55A] text-[#C5A55A]" />
                    ))}
                  </div>
                  <p className="font-playfair text-white/85 text-sm italic leading-relaxed mb-3">
                    &ldquo;{t("testimonialQuote")}&rdquo;
                  </p>
                  <div className="text-[#C5A55A] text-xs font-semibold">{t("testimonialAuthor")}</div>
                  <div className="text-white/40 text-xs">{t("testimonialRole")}</div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E4DE] rounded-2xl p-8 md:p-10">
                <h2 className="font-playfair text-2xl font-bold text-[#0A1628] mb-2">{t("formTitle")}</h2>
                <p className="text-[#6B7280] text-sm mb-8">{t("formSubtitle")}</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
