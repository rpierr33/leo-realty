"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
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
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-400",
        isTransparent
          ? "bg-transparent"
          : "bg-[#0A1628]/97 backdrop-blur-md shadow-xl shadow-black/20"
      )}
    >
      {/* Announcement bar */}
      <div
        className={cn(
          "transition-all duration-400 overflow-hidden",
          scrolled ? "h-0 opacity-0" : "h-auto opacity-100"
        )}
      >
        <div className="bg-[#C5A55A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-2 text-xs font-semibold text-[#0A1628]">
            <span className="tracking-wide">MR 2% Commission &nbsp;·&nbsp; 32 Years In Business &nbsp;·&nbsp; No One Does It Better</span>
            <a
              href="tel:+13057052030"
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              <Phone className="w-3 h-3" />
              (305) 705-2030
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/leo-logo.png"
              alt="Leo Realty Capital Investments"
              width={200}
              height={100}
              className="h-14 w-auto object-contain brightness-0 invert"
              priority
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                {link.children ? (
                  <button
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-150 rounded",
                      pathname.startsWith(link.href)
                        ? "text-[#C5A55A]"
                        : "text-white/85 hover:text-[#C5A55A]"
                    )}
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        activeDropdown === link.label ? "rotate-180" : ""
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-3 py-2 text-sm font-medium transition-colors duration-150 rounded relative",
                      pathname === link.href
                        ? "text-[#C5A55A]"
                        : "text-white/85 hover:text-[#C5A55A]"
                    )}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <span className="absolute bottom-0 left-3 right-3 h-px bg-[#C5A55A] opacity-60" />
                    )}
                  </Link>
                )}

                {link.children && activeDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 w-52 bg-[#0A1628] border border-white/8 rounded-xl shadow-2xl shadow-black/40 py-2 z-50 mt-1"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-white/75 hover:text-[#C5A55A] hover:bg-white/4 transition-colors"
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
            <a
              href="tel:+13057052030"
              className="flex items-center gap-1.5 text-white/70 text-sm hover:text-[#C5A55A] transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>(305) 705-2030</span>
            </a>
            <Link
              href="/contact"
              className="bg-[#C5A55A] text-[#0A1628] font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[#D4BA7A] transition-colors shadow-lg shadow-[#C5A55A]/20"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-white p-2 -mr-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#0A1628] border-t border-white/8 pb-6 pt-2">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium transition-colors border-b border-white/4",
                    pathname === link.href
                      ? "text-[#C5A55A]"
                      : "text-white/80 hover:text-[#C5A55A]"
                  )}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="bg-[#152238]">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block pl-8 pr-4 py-2.5 text-sm text-white/55 hover:text-[#C5A55A] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="px-4 pt-5 flex flex-col gap-3">
              <a
                href="tel:+13057052030"
                className="flex items-center justify-center gap-2 border border-white/20 text-white font-medium text-sm py-3 rounded-full hover:border-[#C5A55A] hover:text-[#C5A55A] transition-colors"
              >
                <Phone className="w-4 h-4" />
                (305) 705-2030
              </a>
              <Link
                href="/contact"
                className="block text-center bg-[#C5A55A] text-[#0A1628] font-semibold text-sm py-3 rounded-full hover:bg-[#D4BA7A] transition-colors"
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
