import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  TrendingUp,
  MessageSquare,
  Share2,
  Eye,
  Type,
  Globe,
  Database,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LucideLoader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RetryButton } from "@/components/dashboard/retry-button";
import { DeleteScrapeButton } from "@/components/dashboard/delete-button";

export default async function ScrapeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const scrape = await prisma.scrapeRequest.findUnique({
    where: { id, userId: session.user.id },
    include: { result: true },
  });

  if (scrape) {
    console.log("DEBUG: Raw Scrape Data from DB:", JSON.stringify(scrape, null, 2));
    if (scrape.result) {
      console.log("DEBUG: Raw Scrape Result Content:", JSON.stringify(scrape.result.rawData, null, 2));
    }
  }

  if (!scrape) {
    notFound();
  }

  const metrics = scrape.result ? [
    { label: "Reacciones", value: scrape.result.reactions, icon: TrendingUp, color: "text-emerald-400" },
    { label: "Comentarios", value: scrape.result.comments, icon: MessageSquare, color: "text-blue-400" },
    { label: "Compartidos", value: scrape.result.shares, icon: Share2, color: "text-indigo-400" },
    { label: "Vistas", value: scrape.result.views, icon: Eye, color: "text-amber-400" },
  ] : [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-4">
        <div className="space-y-1">
          <Button variant="ghost" className="text-zinc-500 hover:text-white mb-2 -ml-2" asChild>
            <Link href="/dashboard/scrapes">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center truncate max-w-md md:max-w-2xl">
            {scrape.url}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 font-medium">
             <div className="flex items-center">
                <Calendar size={14} className="mr-1.5" />
                {new Date(scrape.createdAt).toLocaleDateString()}
             </div>
             <div className="flex items-center">
                <Clock size={14} className="mr-1.5" />
                {new Date(scrape.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </div>
             <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400 uppercase tracking-widest">
                {scrape.network} • {scrape.result?.contentType || scrape.type}
             </Badge>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          {(scrape.status === "error" || scrape.status === "pending") && (
            <RetryButton id={scrape.id} variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" />
          )}
          <DeleteScrapeButton id={scrape.id} variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-red-500" />
          <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white" asChild>
            <a href={scrape.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Ver Original
            </a>
          </Button>
          <Badge className={cn(
            "text-xs px-3 py-1 border capitalize",
            scrape.status === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
            scrape.status === "error" ? "bg-red-500/10 text-red-500 border-red-500/20" :
            "bg-amber-500/10 text-amber-500 border-amber-500/20"
          )}>
            {scrape.status === "processing" ? <LucideLoader2 className="animate-spin mr-2 h-3 w-3" /> : null}
            {scrape.status}
          </Badge>
        </div>
      </div>

      {scrape.status === "error" && scrape.result?.error && (
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="pt-6 flex items-start gap-x-4">
             <AlertCircle className="text-red-500 shrink-0" size={24} />
              <div className="flex justify-between items-start w-full">
                 <div className="space-y-1">
                    <p className="font-bold text-red-500">Error en el procesamiento</p>
                    <p className="text-sm text-red-400/80 leading-relaxed">
                       {scrape.result.error}
                    </p>
                 </div>
                 <RetryButton id={scrape.id} variant="default" className="bg-red-600 hover:bg-red-700 text-white border-none shrink-0" />
              </div>
          </CardContent>
        </Card>
      )}

      {scrape.status === "processing" && (
        <Card className="bg-amber-500/5 border-amber-500/20 animate-pulse">
           <CardContent className="pt-6 flex items-start gap-x-4">
              <Clock className="text-amber-500 shrink-0" size={24} />
              <div className="space-y-1 text-amber-400">
                 <p className="font-bold">Solicitud en proceso...</p>
                 <p className="text-sm">Estamos extrayendo los datos de la red social. Refresca la página en unos momentos.</p>
              </div>
           </CardContent>
        </Card>
      )}

      {metrics.length > 0 && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric: any) => (
            <Card key={metric.label} className="bg-zinc-900 border-zinc-800 border overflow-hidden relative group">
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition duration-500", metric.color.replace('text', 'from'))}></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{metric.label}</CardTitle>
                <metric.icon className={metric.color} size={18} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white tracking-tight">{metric.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
         <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
               <CardTitle className="text-lg text-white font-bold flex items-center">
                  <Database className="mr-2 h-5 w-5 text-indigo-400" />
                  Metadatos de la Tarea
               </CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="space-y-4">
                   <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <dt className="text-sm text-zinc-500">Task ID (Backend)</dt>
                      <dd className="text-sm text-zinc-300 font-mono">{scrape.taskId || 'No asignado'}</dd>
                   </div>
                   <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <dt className="text-sm text-zinc-500">Network</dt>
                      <dd className="text-sm text-white capitalize">{scrape.network}</dd>
                   </div>
                   <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <dt className="text-sm text-zinc-500">Tipo de Contenido</dt>
                      <dd className="text-sm text-white capitalize">{scrape.type}</dd>
                   </div>
                   <div className="flex justify-between items-center pb-2">
                      <dt className="text-sm text-zinc-500">Solicitado Por</dt>
                      <dd className="text-sm text-indigo-400">{session.user.name}</dd>
                   </div>
                </dl>
            </CardContent>
         </Card>

         <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
               <CardTitle className="text-lg text-white font-bold flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-indigo-400" />
                  Estado del Servicio
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-start gap-x-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                     <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Conexión Exitosa</p>
                    <p className="text-xs text-zinc-500">La vinculación con el backend FastAPI está activa.</p>
                  </div>
               </div>
               {scrape.status === 'success' && (
                 <div className="pt-4 mt-4 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-3">Resumen de Extracción</p>
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">
                      DATOS LISTOS
                    </div>
                    <p className="text-sm text-zinc-400 mt-2">Se han procesado todas las métricas de engagement solicitadas.</p>
                 </div>
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
