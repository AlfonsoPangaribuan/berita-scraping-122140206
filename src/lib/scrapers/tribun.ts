import { Article, ArticleDetail } from '@/types/news';
import { NewsScraper } from './base';

export class TribunScraper extends NewsScraper {
  protected baseUrl = 'https://www.tribunnews.com';
  protected source = 'tribun' as const;

  async getLatestNews(): Promise<Article[]> {
    const $ = await this.fetchHtml(this.baseUrl);
    const articles: Article[] = [];

    // Selector untuk artikel di halaman utama
    $('.txt-oev-2, .art-list').each((_, element) => {
      const $element = $(element);
      const title = $element.find('h3 a, h4 a').text().trim();
      const url = $element.find('h3 a, h4 a').attr('href') || '';
      const imageUrl = $element.find('img').attr('src');
      const description = $element.find('h3 a, h4 a').attr('title')?.trim() || '';
      
      if (title && url && imageUrl && 
          !url.includes('/tag/') && 
          !url.includes('/video/') && 
          !url.includes('/foto/')) {
        articles.push({
          title,
          url: this.normalizeUrl(url),
          imageUrl: this.normalizeUrl(imageUrl),
          description,
          publishedAt: new Date(),
          source: this.source
        });
      }
    });

    return articles;
  }

  private parseDate(dateStr: string): Date {
    try {
      if (!dateStr) return new Date();

      // Format: "2 jam yang lalu", "5 menit yang lalu"
      if (dateStr.includes('yang lalu')) {
        const now = new Date();
        const [amount, unit] = dateStr.split(' ');
        const value = parseInt(amount);

        if (unit.includes('menit')) {
          now.setMinutes(now.getMinutes() - value);
          return now;
        } else if (unit.includes('jam')) {
          now.setHours(now.getHours() - value);
          return now;
        } else if (unit.includes('hari')) {
          now.setDate(now.getDate() - value);
          return now;
        }
        return now;
      }

      // Format: "Minggu, 17 Maret 2024 14:30 WIB"
      const cleanStr = dateStr.replace('WIB', '').trim();
      const [_, datePart, time] = cleanStr.split(', ');
      const [day, month, year] = datePart.split(' ');
      const [hour, minute] = time.trim().split(':');

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
    const $ = await this.fetchHtml(url);
    
    // Hapus elemen yang tidak diperlukan
    $('script').remove();
    $('.ads, .artikel--iframefixed, .artikel--newsletter').remove();
    $('.baca-juga, .related-box, .box-outlink').remove();
    
    const title = $('.detail-title, .read__title').text().trim();
    const imageUrl = $('.detail-img img, .read__photo img').attr('src');
    const content = $('.detail-text, .read__content')
      .find('p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(text => 
        text && 
        !text.includes('Baca:') && 
        !text.includes('Baca juga:') &&
        !text.includes('BACA JUGA:') &&
        !text.includes('ADVERTISEMENT')
      )
      .join('\n\n');
    const author = $('.reporter__name, .read__reporter').text().trim();
    const category = $('.breadcrumb__link').first().text().trim();
    const dateStr = $('.detail__date-created, .read__time').text().trim();

    if (!title || !imageUrl || !content) {
      throw new Error('Konten artikel tidak valid');
    }

    return {
      title,
      url,
      imageUrl: this.normalizeUrl(imageUrl),
      content,
      author: author || 'Tribun News',
      category: category || 'Berita',
      publishedAt: this.parseDate(dateStr),
      source: this.source
    };
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