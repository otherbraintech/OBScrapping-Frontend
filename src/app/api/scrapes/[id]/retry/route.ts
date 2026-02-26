import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const SCRAPER_API_URL = process.env.SCRAPER_API_URL || 'https://intelexia-labs-obscrapping.af9gwe.easypanel.host';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const scrapeRequest = await prisma.scrapeRequest.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!scrapeRequest) {
      return NextResponse.json({ error: 'Scrape no encontrado' }, { status: 404 });
    }

    // Actualizar a estado pending antes de llamar al backend
    await prisma.scrapeRequest.update({
      where: { id },
      data: {
        status: 'pending',
        updatedAt: new Date(),
      },
    });

    // Llamar al backend FastAPI para re-iniciar el scrape
    try {
      const scraperRes = await fetch(`${SCRAPER_API_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: scrapeRequest.url,
          type: scrapeRequest.type,
          network: scrapeRequest.network,
        }),
      });

      const scraperData = await scraperRes.json();

      if (!scraperRes.ok) {
        throw new Error(scraperData.message || 'Error en el servicio de scraping');
      }

      await prisma.scrapeRequest.update({
        where: { id },
        data: {
          taskId: scraperData.task_id,
          status: 'processing',
        },
      });

      return NextResponse.json({ 
        message: 'Reintento iniciado', 
        id,
        task_id: scraperData.task_id 
      });

    } catch (scraperError: any) {
      console.error('Retry scraper service error:', scraperError);
      
      await prisma.scrapeRequest.update({
        where: { id },
        data: {
          status: 'error',
        },
      });

      return NextResponse.json({ 
        error: 'El servicio de scraping no respondió al reintento',
        details: scraperError.message
      }, { status: 502 });
    }

  } catch (error: any) {
    console.error('Retry scrape error:', error);
    return NextResponse.json({ error: 'Error al procesar reintento' }, { status: 500 });
  }
}
