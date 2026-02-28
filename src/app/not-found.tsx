import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-extrabold text-indigo-500/20">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Página no encontrada</h2>
          <p className="text-zinc-500">No pudimos encontrar la página que estás buscando.</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
          <Link href="/dashboard">Volver al Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
