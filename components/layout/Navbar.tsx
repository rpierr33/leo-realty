"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Properties", href: "/properties" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Buy a Home", href: "/services#buying" },
      { label: "Sell Your Home", href: "/services#selling" },
      { label: "Rent a Property", href: "/services#renting" },
      { label: "Mortgage Lending", href: "/services#mortgage" },
    ],
  },
  { label: "Loan Programs", href: "/loan-programs" },
  { label: "Team", href: "/team" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isHomePage = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHomePage
          ? "bg-[#0A1628] shadow-lg"
          : "bg-transparent"
      )}
    >
      {/* Top bar */}
      <div className="bg-[#C5A55A] text-[#0A1628] py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm font-medium">
          <span>MR 2% | 32 Years In Business | No One Does It Better</span>
          <a href="tel:+13057052030" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <Phone className="w-3.5 h-3.5" />
            (305) 705-2030
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A55A] flex items-center justify-center">
              <span className="text-[#0A1628] font-bold text-lg font-[var(--font-playfair)]">L</span>
            </div>
            <div className="leading-tight">
              <div className="text-white font-bold text-base tracking-wide font-[var(--font-playfair)]">
                Leo Realty
              </div>
              <div className="text-[#C5A55A] text-xs tracking-wider">
                Capital Investments
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                {link.children ? (
                  <button
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors",
                      pathname.startsWith(link.href)
                        ? "text-[#C5A55A]"
                        : "text-white/90 hover:text-[#C5A55A]"
                    )}
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded transition-colors",
                      pathname === link.href
                        ? "text-[#C5A55A]"
                        : "text-white/90 hover:text-[#C5A55A]"
                    )}
                  >
                    {link.label}
                  </Link>
                )}

                {link.children && activeDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 w-52 bg-[#0A1628] border border-[#C5A55A]/20 rounded-lg shadow-xl py-2 z-50"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-white/80 hover:text-[#C5A55A] hover:bg-white/5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="bg-[#C5A55A] text-[#0A1628] font-semibold text-sm px-5 py-2 rounded-full hover:bg-[#D4B96A] transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#0A1628] border-t border-white/10 pb-4">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-[#C5A55A]"
                      : "text-white/80 hover:text-[#C5A55A]"
                  )}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="pl-8">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-white/60 hover:text-[#C5A55A] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="px-4 pt-4">
              <Link
                href="/contact"
                className="block w-full text-center bg-[#C5A55A] text-[#0A1628] font-semibold text-sm px-5 py-3 rounded-full hover:bg-[#D4B96A] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
