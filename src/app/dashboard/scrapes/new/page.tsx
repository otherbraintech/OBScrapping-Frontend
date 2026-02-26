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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const url = formData.get("url");
    const network = formData.get("network");
    const type = formData.get("type");

    try {
      const res = await fetch("/api/scrapes", {
        method: "POST",
        body: JSON.stringify({ url, network, type }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("DEBUG: Scrape response:", data);

      if (!res.ok) {
        throw new Error(data.error || data.details || "Error al iniciar el scrape");
      }

      // Simplemente redirigir. Next.js se encargará de refrescar la ruta.
      router.push("/dashboard/scrapes");
    } catch (err: any) {
      console.error("DEBUG: Submit error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
          <Search className="mr-3 text-indigo-500" />
          Nueva Solicitud de Scraping
        </h2>
        <p className="text-zinc-500 mt-1">
          Ingresa la URL del contenido que deseas analizar. Soportamos Facebook Reels y Posts.
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-white text-lg">Configuración del Scrape</CardTitle>
            <CardDescription className="text-zinc-500">
              Define los parámetros para la extracción de datos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="url" className="text-zinc-400">URL del Contenido</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input 
                  id="url" 
                  name="url" 
                  placeholder="https://www.facebook.com/share/r/..." 
                  required 
                  className="bg-zinc-800/50 border-zinc-700 text-white pl-10 focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-zinc-400">Red Social</Label>
                <Tabs defaultValue="facebook" className="w-full">
                  <TabsList className="bg-zinc-800 border-zinc-700 w-full">
                    <TabsTrigger value="facebook" className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      Facebook
                    </TabsTrigger>
                    <TabsTrigger value="instagram" disabled className="flex-1">
                      Instagram
                    </TabsTrigger>
                  </TabsList>
                  <input type="hidden" name="network" value="facebook" />
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400">Tipo de Contenido</Label>
                <Tabs defaultValue="reel" className="w-full">
                  <TabsList className="bg-zinc-800 border-zinc-700 w-full">
                    <TabsTrigger value="reel" className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      Reel
                    </TabsTrigger>
                    <TabsTrigger value="post" className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                      Post
                    </TabsTrigger>
                  </TabsList>
                  <input type="hidden" name="type" value="reel" />
                </Tabs>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/5 flex gap-x-4">
               <Globe className="text-indigo-400 shrink-0 mt-1" size={20} />
               <div className="space-y-1">
                  <p className="text-sm font-medium text-white">Scraping en segundo plano</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    El proceso puede tardar entre 1 y 3 minutos dependiendo de la complejidad del contenido. 
                    Recibirás una notificación y el dashboard se actualizará automáticamente cuando los datos estén listos.
                  </p>
               </div>
            </div>
          </CardContent>
          <CardFooter className="bg-zinc-900/50 border-t border-zinc-800 pt-6">
            <Button 
              type="submit" 
              className="w-full md:w-auto ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8"
              disabled={loading}
            >
              {loading ? <LucideLoader2 className="animate-spin mr-2" size={18} /> : null}
              Iniciar Extracción
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
