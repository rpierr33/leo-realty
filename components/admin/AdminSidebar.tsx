"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/listings", icon: Home, label: "Listings" },
  { href: "/admin/leads", icon: MessageSquare, label: "Leads" },
  { href: "/admin/team", icon: Users, label: "Team" },
  { href: "/admin/blog", icon: FileText, label: "Blog" },
  { href: "/admin/reporting", icon: BarChart2, label: "Reporting" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-[#0A1628]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C5A55A] flex items-center justify-center">
            <span className="text-[#0A1628] font-bold text-lg font-[var(--font-playfair)]">L</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm font-[var(--font-playfair)]">Leo Realty</div>
            <div className="text-white/40 text-xs">Admin CRM</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/50 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-[#C5A55A] text-[#0A1628]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all mb-1"
        >
          <Home className="w-5 h-5" />
          View Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
