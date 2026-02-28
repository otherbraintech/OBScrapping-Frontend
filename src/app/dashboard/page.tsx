import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
import { 
  Search, 
  History, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  BarChart2,
  Users,
  MessageSquare,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const recentScrapes = await prisma.scrapeRequest.findMany({
    where: { userId: session.user.id },
    include: { result: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const stats = [
    {
      label: "Total Scrapes",
      value: await prisma.scrapeRequest.count({ where: { userId: session.user.id } }),
      icon: Search,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10"
    },
    {
      label: "Completados",
      value: await prisma.scrapeRequest.count({ where: { userId: session.user.id, status: "success" } }),
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10"
    },
    {
      label: "En espera",
      value: await prisma.scrapeRequest.count({ where: { userId: session.user.id, status: "pending" } }),
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10"
    },
    {
      label: "Fallidos",
      value: await prisma.scrapeRequest.count({ where: { userId: session.user.id, status: "error" } }),
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-400/10"
    }
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">
            Dashboard Overview
          </h2>
          <p className="text-zinc-500 max-w-lg leading-relaxed">
            Bienvenido de nuevo, <span className="text-indigo-400 font-medium">{session.user.name}</span>. 
            Aquí tienes un resumen detallado de tus actividades de extracción de datos.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white glow-indigo transition-all duration-300 h-11 px-6 rounded-xl" asChild>
          <Link href="/dashboard/scrapes/new">
            <Search className="mr-2 h-4 w-4" /> Nuevo Scrape
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {stat.label}
              </CardTitle>
              <div className={cn("p-2 rounded-lg transition-all duration-500 group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="mt-2 h-1 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: '40%' }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 glass-card">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/50 pb-6">
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <div className="p-2 mr-3 bg-indigo-500/10 rounded-lg">
                <History className="h-5 w-5 text-indigo-400" />
              </div>
              Scrapes Recientes
            </CardTitle>
            <Button variant="ghost" className="text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/5" asChild>
              <Link href="/dashboard/scrapes">Ver historial completo</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {recentScrapes.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-500 space-y-4">
                <div className="p-4 bg-zinc-800/30 rounded-full">
                  <Search size={48} className="text-zinc-700" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-zinc-400">Sin actividad reciente</p>
                  <p className="text-sm">Tus extracciones aparecerán aquí una vez que comiences.</p>
                </div>
                <Button size="sm" variant="outline" className="border-zinc-800 hover:bg-zinc-800 mt-2" asChild>
                  <Link href="/dashboard/scrapes/new">Comenzar primer scrape</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentScrapes.map((scrape: any) => (
                  <div key={scrape.id} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800/50 hover:border-indigo-500/20 bg-zinc-950/20 hover:bg-zinc-900/40 transition-all duration-300 group">
                    <div className="flex items-center gap-x-4">
                       <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-colors">
                          <Globe size={18} />
                       </div>
                       <div className="flex flex-col space-y-0.5">
                        <span className="text-sm font-semibold text-white truncate max-w-[180px] md:max-w-md">
                          {scrape.url}
                        </span>
                        <div className="flex items-center gap-x-2 text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                          <span>{new Date(scrape.createdAt).toLocaleDateString()}</span>
                          <span className="h-1 w-1 bg-zinc-700 rounded-full" />
                          <span>{scrape.network || 'facebook'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-6">
                      {scrape.status === "success" && scrape.result && (
                        <div className="hidden md:flex items-center gap-x-4 text-xs">
                           <span className="flex items-center text-zinc-400 font-medium">
                            <TrendingUp size={14} className="mr-1.5 text-emerald-400" /> 
                            {scrape.result.reactions.toLocaleString()}
                           </span>
                           <span className="flex items-center text-zinc-400 font-medium">
                            <MessageSquare size={14} className="mr-1.5 text-blue-400" /> 
                            {scrape.result.comments.toLocaleString()}
                           </span>
                        </div>
                      )}
                      <Badge className={cn(
                        "text-[10px] uppercase tracking-tighter px-2.5 py-0.5 border-0 font-bold rounded-lg glow-sm",
                        scrape.status === "success" ? "bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_-5px_rgba(16,185,129,0.4)]" :
                        scrape.status === "error" ? "bg-red-500/10 text-red-400 shadow-[0_0_15px_-5px_rgba(239,68,68,0.4)]" :
                        "bg-amber-500/10 text-amber-500 shadow-[0_0_15px_-5px_rgba(245,158,11,0.4)]"
                      )}>
                        {scrape.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 glass-card overflow-hidden">
          <CardHeader className="border-b border-zinc-800/50 pb-6">
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <div className="p-2 mr-3 bg-indigo-500/10 rounded-lg">
                <BarChart2 className="h-5 w-5 text-indigo-400" />
              </div>
              Rendimiento Global
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-10">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Tasa de éxito</p>
                    <p className="text-3xl font-black text-white">
                      {Math.round(((await prisma.scrapeRequest.count({ where: { userId: session.user.id, status: "success" } })) / 
                      (Math.max(1, await prisma.scrapeRequest.count({ where: { userId: session.user.id } })))) * 100)}%
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <TrendingUp className="text-indigo-400 h-7 w-7" />
                  </div>
                </div>
                <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden p-0.5">
                   <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" 
                    style={{ width: `${Math.round(((await prisma.scrapeRequest.count({ where: { userId: session.user.id, status: "success" } })) / 
                    (Math.max(1, await prisma.scrapeRequest.count({ where: { userId: session.user.id } })))) * 100)}%` }}
                   />
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Social Insights</p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 flex items-center gap-x-5 hover:bg-zinc-900/60 transition-all cursor-default">
                     <div className="h-12 w-12 bg-indigo-500/10 rounded-2xl text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                        <Users size={24} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white">Social Authority</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Cálculo basado en engagement real</p>
                     </div>
                  </div>
                  <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 flex items-center gap-x-5 hover:bg-zinc-900/60 transition-all cursor-default opacity-50 grayscale">
                     <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                        <TrendingUp size={24} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white">Trend Prediction</p>
                        <p className="text-xs text-zinc-500 mt-0.5 italic">Próximamente para Pro</p>
                     </div>
                  </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

