import { NextResponse } from 'next/server';
import { KompasScraper } from '@/lib/scrapers/kompas';
import { TribunScraper } from '@/lib/scrapers/tribun';
import { DetikScraper } from '@/lib/scrapers/detik';

export async function GET() {
  try {
    const kompas = new KompasScraper();
    const tribun = new TribunScraper();
    const detik = new DetikScraper();

    const [kompasNews, tribunNews, detikNews] = await Promise.all([
      kompas.getLatestNews(),
      tribun.getLatestNews(),
      detik.getLatestNews()
    ]);

    const allNews = [...kompasNews, ...tribunNews, ...detikNews].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(allNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil berita' },
      { status: 500 }
    );
  }
}