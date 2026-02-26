import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const SCRAPER_API_URL = process.env.SCRAPER_API_URL || 'https://intelexia-labs-obscrapping.af9gwe.easypanel.host';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { url, type, network } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'La URL es requerida' }, { status: 400 });
    }

    // 1. Crear el registro local en estado "pending"
    const scrapeRequest = await prisma.scrapeRequest.create({
      data: {
        url,
        type: type || 'reel',
        network: network || 'facebook',
        status: 'pending',
        userId: session.user.id,
      },
    });

    // 2. Llamar al backend FastAPI para iniciar el scrape
    try {
      const scraperRes = await fetch(`${SCRAPER_API_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          type: type || 'reel',
          network: network || 'facebook',
        }),
      });

      const scraperData = await scraperRes.json();

      if (!scraperRes.ok) {
        throw new Error(scraperData.message || 'Error en el servicio de scraping');
      }

      // 3. Guardar el task_id retornado por el backend
      await prisma.scrapeRequest.update({
        where: { id: scrapeRequest.id },
        data: {
          taskId: scraperData.task_id,
          status: 'processing',
        },
      });

      return NextResponse.json({ 
        message: 'Scraping iniciado', 
        id: scrapeRequest.id,
        task_id: scraperData.task_id 
      });

    } catch (scraperError: any) {
      console.error('Scraper service error:', scraperError);
      
      await prisma.scrapeRequest.update({
        where: { id: scrapeRequest.id },
        data: {
          status: 'error',
        },
      });

      return NextResponse.json({ 
        error: 'El servicio de scraping no respondió correctamente',
        details: scraperError.message
      }, { status: 502 });
    }

  } catch (error: any) {
    console.error('Create scrape error:', error);
    return NextResponse.json({ error: 'Error al procesar solicitud' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const scrapes = await prisma.scrapeRequest.findMany({
      where: { userId: session.user.id },
      include: { result: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(scrapes);
  } catch (error) {
    console.error('List scrapes error:', error);
    return NextResponse.json({ error: 'Error al listar scrapes' }, { status: 500 });
  }
}
