"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteScrapeButtonProps {
  id: string;
  variant?: "outline" | "ghost" | "destructive";
  className?: string;
  showText?: boolean;
}

export function DeleteScrapeButton({ 
  id, 
  variant = "ghost", 
  className, 
  showText = false 
}: DeleteScrapeButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/scrapes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
        // Si estamos en la página de detalle, redirigir al listado
        if (window.location.pathname.includes(`/scrapes/${id}`)) {
          router.push("/dashboard/scrapes");
        }
      } else {
        const data = await res.json();
        alert(data.error || "Error al eliminar el scrape");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Hubo un error de red al intentar eliminar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={showText ? "sm" : "icon"}
          className={className}
          disabled={loading}
        >
          <Trash2 className={`h-4 w-4 ${showText ? "mr-2" : ""}`} />
          {showText && (loading ? "Eliminando..." : "Eliminar")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            ¿Estás completamente seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del scrape
            y todas las métricas asociadas de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700 border-none"
          >
            {loading ? "Eliminando..." : "Sí, eliminar scrape"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
