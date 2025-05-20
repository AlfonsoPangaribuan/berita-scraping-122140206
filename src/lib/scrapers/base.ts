import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import type { Article, ArticleDetail } from '@/types/news';

export abstract class NewsScraper {
  protected abstract baseUrl: string;
  protected abstract source: Article['source'];
  protected maxRetries = 3;
  protected retryDelay = 1000; // 1 detik

  protected async fetchHtml(url: string, retryCount = 0): Promise<cheerio.CheerioAPI> {
    try {
      console.log(`Fetching ${url}... (Attempt ${retryCount + 1}/${this.maxRetries})`);
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        timeout: 10000,
        maxRedirects: 5
      });
      console.log(`Successfully fetched ${url}`);
      return cheerio.load(data);
    } catch (error) {
      console.error(`Error fetching ${url} (Attempt ${retryCount + 1}/${this.maxRetries}):`, error);
      
      // Handle specific error cases
      if (error instanceof AxiosError) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.response?.status === 429) {
          if (retryCount < this.maxRetries - 1) {
            console.log(`Retrying in ${this.retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            return this.fetchHtml(url, retryCount + 1);
          }
        }

        // Handle specific HTTP status codes
        if (error.response?.status === 404) {
          throw new Error('Halaman tidak ditemukan');
        }
        if (error.response?.status === 403) {
          throw new Error('Akses ditolak');
        }
      }

      throw new Error(`Gagal mengambil data dari ${url}: ${error.message}`);
    }
  }

  protected normalizeUrl(url: string): string {
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    if (!url.startsWith('http')) {
      return `${this.baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return url;
  }

  abstract getLatestNews(): Promise<Article[]>;
  abstract getArticleDetail(url: string): Promise<ArticleDetail>;
}