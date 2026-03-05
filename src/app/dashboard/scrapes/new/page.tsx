"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LucideLoader2, Search, Link as LinkIcon, Globe, ChevronDown, ListFilter, PlayCircle, UserCircle, Zap, Settings2 } from "lucide-react";

function NewScrapeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [network, setNetwork] = useState("facebook");
  const [type, setType] = useState("auto");
  const [urlValue, setUrlValue] = useState("");
  const [scrollCount, setScrollCount] = useState(5);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const urlParam = searchParams.get("url");
    const typeParam = searchParams.get("type");
    const networkParam = searchParams.get("network");

    if (urlParam) setUrlValue(urlParam);
    if (typeParam) setType(typeParam as any);
    if (networkParam) setNetwork(networkParam as any);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; 
    
    setLoading(true);
    setError("");

    try {
      const typeToSend = type === "auto" ? null : (type === "video" ? "reel" : type);
      
      const res = await fetch("/api/scrapes", {
        method: "POST",
        body: JSON.stringify({ 
          url: urlValue, 
          network, 
          type: typeToSend,
          scrollCount: type === "page_feed" ? scrollCount : 0 
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.details || "Error al iniciar el scrape");
      router.push("/dashboard/scrapes");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight text-white flex items-center bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
          <div className="p-3 mr-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 glow-indigo">
            <Search className="h-6 w-6 text-indigo-400" />
          </div>
          Nueva Extracción
        </h2>
        <p className="text-zinc-500 max-w-2xl leading-relaxed pl-16">
          Nuestra IA procesará el contenido para extraer métricas de engagement, sentimientos y tendencias 
          en tiempo real. Solo pega la URL y nosotros nos encargamos del resto.
        </p>
      </div>

      <Card className="glass-card shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <form onSubmit={handleSubmit}>
          <CardHeader className="border-b border-zinc-800/50 pb-8 pt-8">
            <CardTitle className="text-white text-xl">Configuración de Inteligencia</CardTitle>
            <CardDescription className="text-zinc-500">
              Personaliza los parámetros de búsqueda para obtener mejores resultados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 pt-10">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm flex items-center animate-in zoom-in-95 duration-300">
                <LucideLoader2 className="mr-3 h-4 w-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <Label className="text-sm font-bold text-zinc-400 uppercase tracking-widest pl-1">Selecciona Modo de Extracción</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card Auto */}
                <div 
                  onClick={() => setType("auto")}
                  className={cn(
                    "p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group",
                    type === "auto" ? "bg-indigo-500/10 border-indigo-500 shadow-lg glow-indigo" : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="flex flex-col gap-y-3 relative z-10">
                    <div className={cn("p-2 rounded-lg w-fit transition-colors", type === "auto" ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700")}>
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Auto-detección</h4>
                      <p className="text-xs text-zinc-500 mt-1">Nuestra IA elige el mejor scraper basado en la URL.</p>
                    </div>
                  </div>
                </div>

                {/* Card Page Feed */}
                <div 
                  onClick={() => setType("page_feed")}
                  className={cn(
                    "p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group",
                    type === "page_feed" ? "bg-emerald-500/10 border-emerald-500 shadow-lg glow-emerald" : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="flex flex-col gap-y-3 relative z-10">
                    <div className={cn("p-2 rounded-lg w-fit transition-colors", type === "page_feed" ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700")}>
                      <ListFilter size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Scraping de Página</h4>
                      <p className="text-xs text-zinc-500 mt-1">Extrae múltiples publicaciones de un perfil o fanpage.</p>
                    </div>
                  </div>
                </div>

                {/* Card Single Item */}
                <div 
                  onClick={() => setType("reel")}
                  className={cn(
                    "p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group",
                    (type === "reel" || type === "post" || type === "video") ? "bg-blue-500/10 border-blue-500 shadow-lg" : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="flex flex-col gap-y-3 relative z-10">
                    <div className={cn("p-2 rounded-lg w-fit transition-colors", (type === "reel" || type === "post" || type === "video") ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700")}>
                      <PlayCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Análisis Individual</h4>
                      <p className="text-xs text-zinc-500 mt-1">Métricas profundas de un solo Reel, Video o Post.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-opciones para Análisis Individual */}
              {(type === "reel" || type === "post" || type === "video") && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-xl w-fit">
                    <button 
                      type="button"
                      onClick={() => setType("reel")}
                      className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", type === "reel" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300")}
                    >
                      Reel
                    </button>
                    <button 
                      type="button"
                      onClick={() => setType("post")}
                      className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", type === "post" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300")}
                    >
                      Post
                    </button>
                    <button 
                      type="button"
                      onClick={() => setType("video")}
                      className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", type === "video" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300")}
                    >
                      Video FB
                    </button>
                  </div>
                </div>
              )}

              {/* Ajustes Avanzados para Page Feed */}
              {type === "page_feed" && (
                <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 animate-in zoom-in-95 duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2 text-emerald-400">
                      <Settings2 size={16} />
                      <span className="text-sm font-bold uppercase tracking-wider">Ajustes de Extracción Masiva</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs text-zinc-400">Profundidad de Búsqueda (Scrolls)</Label>
                      <span className="text-emerald-400 font-mono font-bold bg-emerald-400/10 px-2 py-0.5 rounded text-sm">{scrollCount}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      value={scrollCount}
                      onChange={(e) => setScrollCount(parseInt(e.target.value))}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <p className="text-[10px] text-zinc-500 italic">Un valor más alto extraerá más publicaciones pero tomará más tiempo.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label htmlFor="url" className="text-sm font-bold text-zinc-400 uppercase tracking-widest pl-1">URL de Destino</Label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500 pointer-events-none"></div>
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                <Input 
                  id="url" 
                  name="url" 
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder={type === "page_feed" ? "https://www.facebook.com/PAGINA" : "https://www.facebook.com/reel/..."} 
                  required 
                  className="bg-zinc-950/50 border-zinc-800 h-14 text-white pl-12 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:ring-offset-0 focus-visible:border-indigo-500/50 transition-all border-2"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-zinc-400 uppercase tracking-widest pl-1">Fuente de Datos</Label>
              <Tabs value={network} onValueChange={setNetwork} className="w-full">
                <TabsList className="bg-zinc-950 border-2 border-zinc-800 w-full h-14 p-1 rounded-xl max-w-md">
                  <TabsTrigger value="facebook" className="flex-1 h-full rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                    Facebook
                  </TabsTrigger>
                  <TabsTrigger value="instagram" disabled className="flex-1 opacity-50 cursor-not-allowed">
                    Instagram
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="p-6 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 flex gap-x-5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Globe size={80} className="text-indigo-400 rotate-12" />
               </div>
               <div className="p-3 bg-indigo-500/10 rounded-xl h-fit border border-indigo-500/20">
                 <Globe className="text-indigo-400" size={24} />
               </div>
               <div className="space-y-2">
                  <p className="text-base font-bold text-white">Algoritmos de Alta Precisión</p>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-xl">
                    Utilizamos proxies residenciales de baja latencia para asegurar que la extracción sea indetectable 
                    y sumamente precisa. El procesamiento ocurre en tiempo casi real.
                  </p>
               </div>
            </div>
          </CardContent>
          <CardFooter className="bg-zinc-950/30 border-t border-zinc-800/50 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-xs text-zinc-500">
               <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
               Servidores listos para procesamiento
            </div>
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-14 rounded-xl font-bold text-lg glow-indigo transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? <LucideLoader2 className="animate-spin mr-3" size={20} /> : null}
              {loading ? "Procesando..." : "Lanzar Extracción"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function NewScrapePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <LucideLoader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <NewScrapeForm />
    </Suspense>
  );
}

