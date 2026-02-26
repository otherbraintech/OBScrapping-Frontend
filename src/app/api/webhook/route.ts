import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Webhook received:', data);

    const { task_id, url, status, error, scraped_at, reactions, comments, shares, views, content_type } = data;

    if (!task_id) {
      return NextResponse.json({ error: 'Falta task_id' }, { status: 400 });
    }

    // Buscar la solicitud de scrape correspondiente
    const scrapeRequest = await prisma.scrapeRequest.findUnique({
      where: { taskId: task_id },
    });

    if (!scrapeRequest) {
      console.warn(`ScrapeRequest no encontrado para task_id: ${task_id}`);
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }

    // Actualizar el estado de la solicitud
    await prisma.scrapeRequest.update({
      where: { id: scrapeRequest.id },
      data: {
        status: status || 'success',
      },
    });

    // Guardar o actualizar el resultado
    await prisma.scrapeResult.upsert({
      where: { requestId: scrapeRequest.id },
      update: {
        contentType: content_type || 'unknown',
        reactions: reactions || 0,
        comments: comments || 0,
        shares: shares || 0,
        views: views || 0,
        error: error || null,
        scrapedAt: scraped_at ? new Date(scraped_at) : new Date(),
        rawData: data,
      },
      create: {
        requestId: scrapeRequest.id,
        contentType: content_type || 'unknown',
        reactions: reactions || 0,
        comments: comments || 0,
        shares: shares || 0,
        views: views || 0,
        error: error || null,
        scrapedAt: scraped_at ? new Date(scraped_at) : new Date(),
        rawData: data,
      },
    });

    return NextResponse.json({ message: 'Webhook procesado con éxito' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Error al procesar webhook' }, { status: 500 });
  }
}
