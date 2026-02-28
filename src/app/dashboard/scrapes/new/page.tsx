"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { LucideLoader2, Search, Link as LinkIcon, Globe } from "lucide-react";

export default function NewScrapePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [network, setNetwork] = useState("facebook");
  const [type, setType] = useState("reel");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; // Prevent double submit
    
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const url = formData.get("url");
    const networkVal = formData.get("network") || network;
    const typeVal = formData.get("type") || type;

    try {
      const res = await fetch("/api/scrapes", {
        method: "POST",
        body: JSON.stringify({ url, network: networkVal, type: typeVal }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("DEBUG: Scrape response:", data);

      if (!res.ok) {
        throw new Error(data.error || data.details || "Error al iniciar el scrape");
      }

      // Redirigimos sin actualizar setLoading(false) para evitar race conditions
      // El componente se desmontará al navegar.
      router.push("/dashboard/scrapes");
    } catch (err: any) {
      console.error("DEBUG: Submit error:", err);
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
            
            <div className="space-y-3">
              <Label htmlFor="url" className="text-sm font-bold text-zinc-400 uppercase tracking-widest pl-1">URL de Destino</Label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500 pointer-events-none"></div>
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                <Input 
                   id="url" 
                  name="url" 
                  placeholder="https://www.facebook.com/share/r/..." 
                  required 
                  className="bg-zinc-950/50 border-zinc-800 h-14 text-white pl-12 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:ring-offset-0 focus-visible:border-indigo-500/50 transition-all border-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-zinc-400 uppercase tracking-widest pl-1">Fuente de Datos</Label>
                <Tabs value={network} onValueChange={setNetwork} className="w-full">
                  <TabsList className="bg-zinc-950 border-2 border-zinc-800 w-full h-14 p-1 rounded-xl">
                    <TabsTrigger value="facebook" className="flex-1 h-full rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                      Facebook
                    </TabsTrigger>
                    <TabsTrigger value="instagram" disabled className="flex-1 opacity-50 cursor-not-allowed">
                      Instagram
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold text-zinc-400 uppercase tracking-widest pl-1">Formato</Label>
                <Tabs value={type} onValueChange={setType} className="w-full">
                  <TabsList className="bg-zinc-950 border-2 border-zinc-800 w-full h-14 p-1 rounded-xl">
                    <TabsTrigger value="reel" className="flex-1 h-full rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                      Reel
                    </TabsTrigger>
                    <TabsTrigger value="post" className="flex-1 h-full rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
                      Post
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <input type="hidden" name="network" value={network} />
            <input type="hidden" name="type" value={type} />
            
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
