"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RetryButtonProps {
  id: string;
  variant?: "outline" | "ghost" | "default";
  className?: string;
  showText?: boolean;
}

export function RetryButton({ 
  id, 
  variant = "outline", 
  className, 
  showText = true 
}: RetryButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRetry = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/scrapes/${id}/retry`, {
        method: "POST",
      });

      if (res.ok) {
        // Refrescar la página para ver el nuevo estado
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Error al reintentar el scrape");
      }
    } catch (error) {
      console.error("Retry error:", error);
      alert("Hubo un error de red al intentar reintentar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={showText ? "sm" : "icon"}
      className={className}
      onClick={handleRetry}
      disabled={loading}
    >
      <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""} ${showText ? "mr-2" : ""}`} />
      {showText && (loading ? "Reintentando..." : "Reintentar")}
    </Button>
  );
}
