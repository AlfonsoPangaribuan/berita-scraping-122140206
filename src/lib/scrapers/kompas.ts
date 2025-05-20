import { Article, ArticleDetail } from '@/types/news';
import { NewsScraper } from './base';

export class KompasScraper extends NewsScraper {
  protected baseUrl = 'https://www.kompas.com';
  protected source = 'kompas' as const;

  async getLatestNews(): Promise<Article[]> {
    const $ = await this.fetchHtml(this.baseUrl);
    const articles: Article[] = [];

    $('.latest__item, .most__item, .article__list, .col-bs10-7 .article__list').each((_, element) => {
      const $element = $(element);
      const title = $element.find('h3.article__title a, .article__link, .latest__title, .most__title').text().trim();
      const url = $element.find('h3.article__title a, .article__link, a').first().attr('href') || '';
      const imageUrl = $element.find('.article__asset img, .article__image img, .latest__img img, .most__img img').attr('src') || 
                      $element.find('.article__asset img, .article__image img, .latest__img img, .most__img img').attr('data-src') || '';
      const description = $element.find('.article__lead, .article__subtitle, .latest__excerpt, .most__excerpt').text().trim();
      
      if (title && url && 
          !url.includes('/tag/') && 
          !url.includes('/video/') && 
          !url.includes('/foto/')) {
        articles.push({
          title,
          url: this.normalizeUrl(url),
          imageUrl: this.normalizeUrl(imageUrl),
          description,
          publishedAt: new Date(), // Tanggal akan diambil dari halaman detail
          source: this.source
        });
      }
    });

    return articles;
  }

  private parseDate(dateStr: string): Date {
    try {
      if (!dateStr) return new Date();

      // Format: "Sabtu, 17 Mei 2025 21:46 WIB"
      const cleanStr = dateStr.replace('WIB', '').trim();
      const [_, datePart, timePart] = cleanStr.split(', ');
      const [day, month, year] = datePart.split(' ');
      const [hour, minute] = timePart.trim().split(':');

      const months: Record<string, string> = {
        'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
        'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
        'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
      };

      const monthNum = months[month] || '01';
      const paddedDay = day.padStart(2, '0');
      return new Date(`${year}-${monthNum}-${paddedDay}T${hour}:${minute}:00+07:00`);
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return new Date();
    }
  }

  async getArticleDetail(url: string): Promise<ArticleDetail> {
    try {
      const $ = await this.fetchHtml(url);
      
      // Hapus elemen yang tidak diperlukan
      $('script').remove();
      $('.ads, .read__advertisement, .article__list--recommendation').remove();
      $('.read__related, .read__tagging, .article__tag').remove();
      
      const title = $('.read__title, .article__title, h1.article__title').text().trim();
      const imageUrl = $('.read__photo img, .article__image img').attr('src') || 
                      $('.read__photo img, .article__image img').attr('data-src') || '';
      const content = $('.read__content, .article__content, .article__body')
        .find('p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => 
          text && 
          !text.includes('ADVERTISEMENT') && 
          !text.includes('Baca juga:') &&
          !text.includes('Baca Juga:') &&
          !text.includes('BACA JUGA:')
        )
        .join('\n\n');
      const author = $('.read__author__name, .article__author, .credit').text().trim();
      const category = $('.read__breadcrumb a, .article__subtitle, .article__channel').first().text().trim();
      const dateStr = $('.read__time, .article__date, .article__date--publish').text().trim();

      if (!title || !content) {
        throw new Error('Konten artikel tidak valid');
      }

      return {
        title,
        url,
        imageUrl: this.normalizeUrl(imageUrl),
        content,
        author: author || 'Kompas.com',
        category: category || 'Berita',
        publishedAt: this.parseDate(dateStr),
        source: this.source
      };
    } catch (error) {
      console.error('Error fetching article detail:', error);
      throw new Error(`Gagal mengambil artikel: ${error.message}`);
    }
  }

  private normalizeUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('//')) return `https:${url}`;
    if (!url.startsWith('http')) {
      return `${this.baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return url;
  }
}