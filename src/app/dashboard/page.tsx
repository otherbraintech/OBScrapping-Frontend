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
  MessageSquare
} from "lucide-react";
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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
        <p className="text-zinc-500 mt-1">
          Bienvenido de nuevo, {session.user.name}. Aquí tienes un resumen de tus actividades de scraping.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-zinc-900 border-zinc-800 border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400">{stat.label}</CardTitle>
              <stat.icon className={stat.color} size={18} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-white flex items-center">
              <History className="mr-2 h-5 w-5 text-indigo-400" />
              Scrapes Recientes
            </CardTitle>
            <Button variant="ghost" className="text-xs text-indigo-400 hover:text-indigo-300" asChild>
              <Link href="/dashboard/scrapes">Ver todo</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentScrapes.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-zinc-500 space-y-3">
                <Search size={40} className="text-zinc-800" />
                <p>No tienes scrapes registrados todavía.</p>
                <Button size="sm" variant="outline" className="border-zinc-800 hover:bg-zinc-800" asChild>
                  <Link href="/dashboard/scrapes/new">Comenzar primer scrape</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentScrapes.map((scrape) => (
                  <div key={scrape.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 transition">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-white truncate max-w-[200px] md:max-w-md">
                        {scrape.url}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(scrape.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-4">
                      {scrape.status === "success" && scrape.result && (
                        <div className="hidden md:flex items-center gap-x-3 text-xs text-zinc-400">
                           <span className="flex items-center"><TrendingUp size={12} className="mr-1 text-emerald-400" /> {scrape.result.reactions}</span>
                           <span className="flex items-center"><MessageSquare size={12} className="mr-1 text-blue-400" /> {scrape.result.comments}</span>
                        </div>
                      )}
                      <Badge className={cn(
                        "text-[10px] px-2 py-0.5 border capitalize",
                        scrape.status === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        scrape.status === "error" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
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

        <Card className="col-span-1 lg:col-span-3 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-indigo-400" />
              Rendimiento Global
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Tasa de éxito</span>
                  <span className="text-white font-medium">
                    {Math.round(((await prisma.scrapeRequest.count({ where: { userId: session.user.id, status: "success" } })) / 
                    (Math.max(1, await prisma.scrapeRequest.count({ where: { userId: session.user.id } })))) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${Math.round(((await prisma.scrapeRequest.count({ where: { userId: session.user.id, status: "success" } })) / 
                    (Math.max(1, await prisma.scrapeRequest.count({ where: { userId: session.user.id } })))) * 100)}%` }}
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 gap-3 pt-2">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center gap-x-3">
                   <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                      <Users size={20} />
                   </div>
                   <div>
                      <p className="text-xs text-zinc-500">Métrica Impacto</p>
                      <p className="text-sm font-bold text-white">Social Authority</p>
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
