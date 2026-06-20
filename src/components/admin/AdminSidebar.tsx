"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  LogOut,
  ExternalLink,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/offers", label: "Offers", icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-full lg:w-64 bg-[#080604] border-r border-[#c9a84c]/12 flex flex-col">
      <div className="p-6 border-b border-[#c9a84c]/12">
        <Link href="/admin" className="block font-serif text-xl text-[#c9a84c]">
          Taania Admin
        </Link>
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[#6b6258] mt-1">
          Store Management
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                active
                  ? "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20"
                  : "text-[#8a7d6e] hover:text-[#f0e8dc] hover:bg-[#110e0a]"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#c9a84c]/12 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-sm text-[#8a7d6e] hover:text-[#c9a84c] transition-colors"
        >
          <ExternalLink size={16} />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#8a7d6e] hover:text-[#c4405a] transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
