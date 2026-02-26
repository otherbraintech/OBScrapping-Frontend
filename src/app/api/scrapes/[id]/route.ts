import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Buscar el scrape para verificar propiedad o si es admin
    const scrape = await prisma.scrapeRequest.findUnique({
      where: { id },
    });

    if (!scrape) {
      return NextResponse.json({ error: 'Scrape no encontrado' }, { status: 404 });
    }

    // Por ahora solo el dueño puede borrar, luego añadiremos lógica de admin
    if (scrape.userId !== session.user.id) {
       // Aquí se podría añadir check de session.user.role === 'admin'
       return NextResponse.json({ error: 'No tienes permiso para borrar este scrape' }, { status: 403 });
    }

    // Al borrar el ScrapeRequest, Prisma debería borrar el ScrapeResult si está configurado en cascade
    // Si no, lo hacemos manualmente
    await prisma.$transaction([
      prisma.scrapeResult.deleteMany({ where: { requestId: id } }),
      prisma.scrapeRequest.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: 'Scrape eliminado correctamente' });
  } catch (error: any) {
    console.error('Delete scrape error:', error);
    return NextResponse.json({ error: 'Error al eliminar el scrape' }, { status: 500 });
  }
}
