"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { logoutAdminAction } from "@/app/actions/auth";
import { Role } from "@prisma/client";
import { isOwner } from "@/lib/auth-helpers";
import {
  LayoutDashboard,
  Package,
  Inbox,
  LogOut,
  Shield,
  Menu,
  X,
  Lock,
  ChevronRight,
} from "lucide-react";

interface AdminSidebarProps {
  user: {
    email: string;
    role: Role;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userIsOwner = isOwner(user.role);

  const navLinks = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
      available: true,
    },
    {
      label: "Packages",
      href: "/admin/packages",
      icon: Package,
      active: pathname.startsWith("/admin/packages"),
      available: userIsOwner,
      badge: !userIsOwner ? "Owner only" : undefined,
    },
    {
      label: "Inquiries",
      href: "/admin/inquiries",
      icon: Inbox,
      active: pathname.startsWith("/admin/inquiries"),
      available: true,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy text-white">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center text-white font-bold text-lg shadow-sm">
            N
          </div>
          <div>
            <div className="font-display font-bold text-base tracking-wide text-white">
              Noor Travels
            </div>
            <div className="text-[10px] tracking-wider uppercase text-gold-light font-semibold">
              Admin Portal
            </div>
          </div>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
          Management
        </div>

        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-gold text-white shadow-sm font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-gold-light"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-normal flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>{item.badge}</span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout Button */}
      <div className="p-4 border-t border-white/10 bg-navy-deep/60">
        <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold-light text-xs font-bold">
            {user.email.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {user.email}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                  userIsOwner
                    ? "bg-gold text-white"
                    : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:text-white hover:bg-red-500/20 transition-all border border-red-400/20 active:scale-98 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-navy text-white px-4 py-3 flex items-center justify-between shadow-md">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <span className="font-display font-bold text-sm tracking-wide">
            Noor Travels Admin
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              userIsOwner ? "bg-gold text-white" : "bg-white/20 text-white"
            }`}
          >
            {user.role}
          </span>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-30 border-r border-border">
        {sidebarContent}
      </aside>
    </>
  );
}
