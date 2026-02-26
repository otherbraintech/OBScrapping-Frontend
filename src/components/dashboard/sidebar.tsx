"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Search, 
  History, 
  Settings, 
  LogOut,
  BarChart3,
  ExternalLink
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-indigo-400",
  },
  {
    label: "Nuevo Scrape",
    icon: Search,
    href: "/dashboard/scrapes/new",
    color: "text-emerald-400",
  },
  {
    label: "Mis Scrapes",
    icon: History,
    href: "/dashboard/scrapes",
    color: "text-blue-400",
  },
  {
    label: "Reportes",
    icon: BarChart3,
    href: "/dashboard/reports",
    color: "text-amber-400",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-zinc-950 text-white border-r border-zinc-900">
      <div className="px-6 py-2">
        <Link href="/dashboard" className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
            OBScrapping
          </h1>
        </Link>
      </div>
      <div className="flex-1 px-3">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition",
                pathname === route.href ? "bg-white/5 text-white" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 mt-auto">
        <button
          onClick={handleLogout}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-lg transition"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </div>
        </button>
      </div>
    </div>
  );
}
