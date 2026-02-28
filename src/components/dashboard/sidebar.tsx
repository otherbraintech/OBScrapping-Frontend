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
import { Button } from "@/components/ui/button";

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
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="space-y-6 py-6 flex flex-col h-full bg-zinc-950 text-white border-r border-zinc-900/50 shadow-2xl">
      <div className="px-8 py-3">
        <Link href="/dashboard" className="flex items-center group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center mr-3 glow-indigo group-hover:scale-110 transition-transform duration-500">
            <BarChart3 className="text-white h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            OBS<span className="text-indigo-500">.</span>
          </h1>
        </Link>
      </div>
      <div className="flex-1 px-4 space-y-8">
        <div className="space-y-1">
          <p className="px-4 mb-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Principal</p>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-4 w-full justify-start font-semibold cursor-pointer rounded-2xl transition-all duration-300 relative overflow-hidden",
                pathname === route.href 
                  ? "bg-white/5 text-white shadow-inner" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              )}
            >
              {pathname === route.href && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full shadow-[4px_0_15px_rgba(99,102,241,0.5)]" />
              )}
              <div className="flex items-center flex-1">
                <route.icon className={cn(
                  "h-5 w-5 mr-4 transition-all duration-500",
                  pathname === route.href ? route.color : "text-zinc-600 group-hover:text-zinc-400"
                )} />
                {route.label}
              </div>
              <ExternalLink className={cn(
                "h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity",
                pathname === route.href && "opacity-20"
              )} />
            </Link>
          ))}
        </div>

        <div className="space-y-4">
           <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Soporte</p>
           <div className="px-4 py-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/10 space-y-3 relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
              <p className="text-xs font-bold text-indigo-400">¿Necesitas ayuda?</p>
              <p className="text-[10px] text-zinc-500 leading-relaxed">Consulta nuestra guía rápida o contacta con soporte técnico.</p>
              <Button size="sm" variant="link" className="p-0 h-auto text-[10px] text-zinc-400 hover:text-white transition-colors">
                Documentación API →
              </Button>
           </div>
        </div>
      </div>
      <div className="px-4 mt-auto">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-6" />
        <button
          onClick={handleLogout}
          className="text-sm group flex p-4 w-full justify-start font-semibold cursor-pointer hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-2xl transition-all duration-300"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-4 transition-transform group-hover:-translate-x-1" />
            Cerrar Sesión
          </div>
        </button>
      </div>
    </div>
  );
}
