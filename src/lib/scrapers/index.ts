import { KompasScraper } from './kompas';
import { DetikScraper } from './detik';
import { TempoScraper } from './tempo';
import type { Article, ArticleDetail } from '@/types/news';

import { TribunScraper } from './tribun';

export class NewsService {
  private detikScraper = new DetikScraper();
  private kompasScraper = new KompasScraper();
  private tribunScraper = new TribunScraper();

  private scrapers = {
    detik: this.detikScraper,
    kompas: this.kompasScraper,
    tribun: this.tribunScraper
  };

  async getAllLatestNews(): Promise<Article[]> {
    const [detikNews, kompasNews, tribunNews] = await Promise.allSettled([
      this.detikScraper.getLatestNews(),
      this.kompasScraper.getLatestNews(),
      this.tribunScraper.getLatestNews()
    ]);

    const articles: Article[] = [];

    if (detikNews.status === 'fulfilled') articles.push(...detikNews.value);
    if (kompasNews.status === 'fulfilled') articles.push(...kompasNews.value);
    if (tribunNews.status === 'fulfilled') articles.push(...tribunNews.value);

    return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getArticleDetail(url: string, source: Article['source']): Promise<ArticleDetail> {
    const scraper = this.scrapers[source];
    if (!scraper) {
      throw new Error(`Unsupported news source: ${source}`);
    }
    return scraper.getArticleDetail(url);
  }
}

export const newsService = new NewsService();