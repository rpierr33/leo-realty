import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#C5A55A] flex items-center justify-center">
                <span className="text-[#0A1628] font-bold text-lg font-serif">L</span>
              </div>
              <div>
                <div className="text-white font-bold tracking-wide font-serif">Leo Realty</div>
                <div className="text-[#C5A55A] text-xs tracking-wider">Capital Investments</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              32 years of trusted real estate expertise in South Florida.
              Mortgages Made Easy, Dreams Made Real.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C5A55A] transition-colors"
                aria-label="Facebook"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C5A55A] transition-colors"
                aria-label="Instagram"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C5A55A] transition-colors"
                aria-label="LinkedIn"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#C5A55A] font-semibold text-sm uppercase tracking-wider mb-5">
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
                    className="text-white/60 text-sm hover:text-[#C5A55A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Loan Programs */}
          <div>
            <h3 className="text-[#C5A55A] font-semibold text-sm uppercase tracking-wider mb-5">
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
                    className="text-white/60 text-sm hover:text-[#C5A55A] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#C5A55A] font-semibold text-sm uppercase tracking-wider mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A55A] flex-shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">
                  909 North Miami Beach Blvd<br />
                  Suite 301A<br />
                  North Miami Beach, FL
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A55A] flex-shrink-0" />
                <a href="tel:+13057052030" className="text-white/60 text-sm hover:text-[#C5A55A] transition-colors">
                  (305) 705-2030
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A55A] flex-shrink-0" />
                <a
                  href="mailto:Info@leorealtycapitalinvestments.com"
                  className="text-white/60 text-sm hover:text-[#C5A55A] transition-colors break-all"
                >
                  Info@leorealtycapital<br />investments.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C5A55A] flex-shrink-0" />
                <span className="text-white/60 text-sm">
                  Mon–Fri: 9:00am – 5:00pm
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Leo Realty Capital Investments. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-white/40 hover:text-[#C5A55A] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="text-white/40 hover:text-[#C5A55A] transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/fair-housing" className="text-white/40 hover:text-[#C5A55A] transition-colors">
              Fair Housing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
