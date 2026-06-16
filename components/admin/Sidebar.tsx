"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  IndianRupee,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/revenue", label: "Revenue", icon: IndianRupee },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const links = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(item)
              ? "bg-forest-700 text-white"
              : "text-gray-200 hover:bg-white/10"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 bg-forest-900 px-4 py-3 text-white md:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-display font-semibold">
          <ShieldCheck className="h-5 w-5 text-gold-400" /> miestate admin
        </Link>
        <button onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-b border-white/10 bg-forest-900 p-4 md:hidden">
          {links}
          <button
            onClick={logout}
            className="mt-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-200 hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" /> Log out
          </button>
        </div>
      )}

      <aside className="hidden w-60 shrink-0 flex-col bg-forest-900 p-4 md:flex">
        <Link
          href="/admin"
          className="mb-6 flex items-center gap-2 px-2 font-display text-lg font-semibold text-white"
        >
          <ShieldCheck className="h-6 w-6 text-gold-400" /> miestate
        </Link>
        {links}
        <button
          onClick={logout}
          className="mt-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-200 hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" /> Log out
        </button>
      </aside>
    </>
  );
}
