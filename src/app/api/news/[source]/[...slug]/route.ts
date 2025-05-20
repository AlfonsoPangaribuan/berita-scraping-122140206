import { NextResponse } from 'next/server';
import { KompasScraper } from '@/lib/scrapers/kompas';
import { TribunScraper } from '@/lib/scrapers/tribun';
import { DetikScraper } from '@/lib/scrapers/detik';

export async function GET(
  request: Request,
  { params }: { params: { source: string; slug: string[] } }
) {
  const paramsData = await Promise.resolve(params);
  const { source, slug } = paramsData;
  
  try {
    const url = slug.join('/');
    let article;

    switch (source.toLowerCase()) {
      case 'kompas':
        const kompasScraper = new KompasScraper();
        article = await kompasScraper.getArticleDetail(url);
        break;
      case 'tribun':
        const tribunScraper = new TribunScraper();
        article = await tribunScraper.getArticleDetail(url);
        break;
      case 'detik':
        const detikScraper = new DetikScraper();
        article = await detikScraper.getArticleDetail(url);
        break;
      default:
        return NextResponse.json(
          { error: 'Sumber berita tidak dikenal' },
          { status: 400 }
        );
    }

    if (!article) {
      return NextResponse.json(
        { error: 'Artikel tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil artikel' },
      { status: 500 }
    );
  }
}