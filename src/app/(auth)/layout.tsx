import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-zinc-950">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-900 via-zinc-950 to-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop')] opacity-10 mix-blend-overlay grayscale"></div>
        <div className="z-10">
          <h1 className="text-4xl font-bold tracking-tight">OBScrapping</h1>
          <p className="mt-4 text-zinc-400 max-w-md">
            Extrae y visualiza métricas de redes sociales en tiempo real con una interfaz premium e inteligente.
          </p>
        </div>
        <div className="z-10">
          <blockquote className="space-y-2">
            <p className="text-lg text-zinc-300 italic">
              "La mejor herramienta para automatizar el seguimiento de engagement en Instagram, Facebook y TikTok."
            </p>
            <footer className="text-sm font-medium text-indigo-400">Ludwig — Lead Developer</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-zinc-950 border-l border-zinc-900">
        <div className="w-full max-w-sm space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
