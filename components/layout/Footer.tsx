import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white">
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C5A55A]/50 to-transparent" />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
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
              32 years of trusted real estate expertise in South Florida.
              Mortgages Made Easy. Dreams Made Real.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-[#C5A55A] text-xs font-semibold tracking-wider uppercase">MR 2%</span>
              <span className="text-white/25 text-xs">·</span>
              <span className="text-white/40 text-xs">No One Does It Better</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A55A] mb-6">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Properties", href: "/properties" },
                { label: "Services", href: "/services" },
                { label: "Loan Programs", href: "/loan-programs" },
                { label: "Meet The Team", href: "/team" },
                { label: "Testimonials", href: "/testimonials" },
                { label: "Blog", href: "/blog" },
                { label: "Leo Promotions", href: "/promotions" },
              ].map((link) => (
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

          {/* Loan Programs */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A55A] mb-6">
              Loan Programs
            </h3>
            <ul className="space-y-2.5">
              {[
                "FHA Loans",
                "VA Loans",
                "USDA Loans",
                "Conventional Loans",
                "DSCR Loans",
                "Hometown Heroes",
                "First-Time Buyer",
              ].map((item) => (
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

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A55A] mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A55A] flex-shrink-0 mt-0.5" />
                <span className="text-white/45 text-sm leading-relaxed">
                  909 North Miami Beach Blvd<br />
                  Suite 301A<br />
                  North Miami Beach, FL
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
                  Mon–Fri: 9:00am – 5:00pm
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Leo Realty Capital Investments. All rights reserved.
            &nbsp;· Equal Housing Opportunity.
          </p>
          <div className="flex items-center gap-5 text-xs">
            <Link href="/privacy" className="text-white/25 hover:text-[#C5A55A] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/25 hover:text-[#C5A55A] transition-colors">
              Terms of Service
            </Link>
            <Link href="/fair-housing" className="text-white/25 hover:text-[#C5A55A] transition-colors">
              Fair Housing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
