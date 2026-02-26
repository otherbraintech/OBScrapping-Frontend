import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
import { 
  Search, 
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Share2,
  Eye,
  Calendar,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ScrapesListPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const scrapes = await prisma.scrapeRequest.findMany({
    where: { userId: session.user.id },
    include: { result: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Mis Scrapes</h2>
          <p className="text-zinc-500 mt-1">
            Listado completo de todas tus extracciones de datos.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
          <Link href="/dashboard/scrapes/new">Nuevo Scrape</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400">URL / Contenido</TableHead>
              <TableHead className="text-zinc-400">Estado</TableHead>
              <TableHead className="text-zinc-400 hidden lg:table-cell">Red</TableHead>
              <TableHead className="text-zinc-400 hidden md:table-cell">Métricas</TableHead>
              <TableHead className="text-zinc-400">Fecha</TableHead>
              <TableHead className="text-right text-zinc-400">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scrapes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-zinc-500">
                  No hay scrapes para mostrar.
                </TableCell>
              </TableRow>
            ) : (
              scrapes.map((scrape) => (
                <TableRow key={scrape.id} className="hover:bg-white/5 border-zinc-800 transition">
                  <TableCell className="font-medium max-w-[200px] lg:max-w-md">
                    <div className="flex flex-col space-y-1">
                      <span className="text-white truncate">{scrape.url}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{scrape.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[10px] px-2 py-0.5 border capitalize",
                      scrape.status === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                      scrape.status === "error" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {scrape.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400 uppercase">
                      {scrape.network}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {scrape.status === "success" && scrape.result ? (
                      <div className="flex items-center gap-x-4 text-xs text-zinc-400">
                        <span className="flex items-center" title="Reacciones">
                          <TrendingUp size={14} className="mr-1.5 text-emerald-500" />
                          {scrape.result.reactions}
                        </span>
                        <span className="flex items-center" title="Comentarios">
                          <MessageSquare size={14} className="mr-1.5 text-blue-500" />
                          {scrape.result.comments}
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-600 text-[10px]">Sin datos</span>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-500 text-xs">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1.5" />
                      {new Date(scrape.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-x-2">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white" asChild>
                          <a href={scrape.url} target="_blank" rel="noopener noreferrer">
                             <ExternalLink size={14} />
                          </a>
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white" asChild>
                          <Link href={`/dashboard/scrapes/${scrape.id}`}>
                             <ChevronRight size={18} />
                          </Link>
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
