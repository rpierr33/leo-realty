import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");

  const quickLinks = [
    { label: t("linkHome"), href: "/" },
    { label: t("linkAbout"), href: "/about" },
    { label: t("linkProperties"), href: "/properties" },
    { label: t("linkServices"), href: "/services" },
    { label: t("linkLoanPrograms"), href: "/loan-programs" },
    { label: t("linkTeam"), href: "/team" },
    { label: t("linkTestimonials"), href: "/testimonials" },
    { label: t("linkBlog"), href: "/blog" },
    { label: t("linkPromotions"), href: "/promotions" },
  ];

  const loanItems = [
    t("loanFha"),
    t("loanVa"),
    t("loanUsda"),
    t("loanConventional"),
    t("loanDscr"),
    t("loanHometownHeroes"),
    t("loanFirstTime"),
  ];

  return (
    <footer className="bg-[#0A1628] text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-[#C5A55A]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/leo-logo.png"
                alt="Leo Realty Capital Investments"
                width={200}
                height={100}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/45 text-sm leading-relaxed mb-6 max-w-xs">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-[#C5A55A] text-xs font-semibold tracking-wider uppercase">MR 2%</span>
              <span className="text-white/25 text-xs">·</span>
              <span className="text-white/40 text-xs">{t("tagShort")}</span>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A55A] mb-6">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/45 text-sm hover:text-[#C5A55A] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A55A] mb-6">
              {t("loanProgramsHeader")}
            </h3>
            <ul className="space-y-2.5">
              {loanItems.map((item) => (
                <li key={item}>
                  <Link
                    href="/loan-programs"
                    className="text-white/45 text-sm hover:text-[#C5A55A] transition-colors duration-150"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A55A] mb-6">
              {t("contactHeader")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A55A] flex-shrink-0 mt-0.5" />
                <span className="text-white/45 text-sm leading-relaxed">
                  {t("addressLine1")}<br />
                  {t("addressLine2")}<br />
                  {t("addressLine3")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A55A] flex-shrink-0" />
                <a
                  href="tel:+13057052030"
                  className="text-white/45 text-sm hover:text-[#C5A55A] transition-colors"
                >
                  (305) 705-2030
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C5A55A] flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:Info@leorealtycapitalinvestments.com"
                  className="text-white/45 text-sm hover:text-[#C5A55A] transition-colors break-all"
                >
                  Info@leorealty<br />capitalinvestments.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C5A55A] flex-shrink-0" />
                <span className="text-white/45 text-sm">
                  {t("hours")}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/6 bg-[#08111F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <p className="text-white/45 text-xs leading-relaxed">
            <span className="text-[#C5A55A] font-semibold">{t("lendingPartnerLabel")}</span>{" "}
            {t("lendingPartnerPrefix")}{" "}
            <a
              href="https://klemortgage.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A55A] underline hover:no-underline"
            >
              KLE Mortgage Financing, LLC
            </a>{" "}
            {t("lendingPartnerSuffix")}
          </p>
        </div>
      </div>

      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Leo Realty Capital Investments. {t("rightsReserved")}
            &nbsp;· {t("equalHousing")}
          </p>
          <div className="flex items-center gap-5 text-xs">
            <Link href="/privacy" className="text-white/25 hover:text-[#C5A55A] transition-colors">
              {t("privacyPolicy")}
            </Link>
            <Link href="/terms" className="text-white/25 hover:text-[#C5A55A] transition-colors">
              {t("termsOfService")}
            </Link>
            <Link href="/fair-housing" className="text-white/25 hover:text-[#C5A55A] transition-colors">
              {t("fairHousing")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
