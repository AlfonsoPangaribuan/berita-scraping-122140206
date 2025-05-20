import { Article, ArticleDetail } from '@/types/news';
import { NewsScraper } from './base';

export class DetikScraper extends NewsScraper {
  protected baseUrl = 'https://www.detik.com';
  protected source = 'detik' as const;

  async getLatestNews(): Promise<Article[]> {
    const $ = await this.fetchHtml(this.baseUrl);
    const articles: Article[] = [];

    $('.grid-row article, .list-content__item, .media-news').each((_, element) => {
      const $element = $(element);
      const title = $element.find('.title, .media__title, h2, h3').text().trim();
      const url = $element.find('a').first().attr('href') || '';
      const imageUrl = $element.find('img').attr('src');
      const description = $element.find('.excerpt, .media__excerpt, .media__subtitle').text().trim();
      const dateStr = $element.find('.date, .media__date, time').text().trim();

      // Filter: hanya ambil artikel dengan gambar dan bukan halaman tag/video
      if (title && url && imageUrl && 
          !url.includes('/tag/') && 
          !url.includes('/video/') && 
          !url.includes('/foto/')) {
        const date = this.parseDate(dateStr);
        articles.push({
          title,
          url,
          imageUrl,
          description,
          publishedAt: date,
          source: this.source
        });
      }
    });

    return articles;
  }

  private parseDate(dateStr: string): Date {
    try {
      if (!dateStr) return new Date();

      // Handle format "X menit/jam yang lalu"
      if (dateStr.includes('yang lalu')) {
        const now = new Date();
        const parts = dateStr.split(' ');
        const value = parseInt(parts[0]);
        
        if (dateStr.includes('menit')) {
          now.setMinutes(now.getMinutes() - value);
          return now;
        } else if (dateStr.includes('jam')) {
          now.setHours(now.getHours() - value);
          return now;
        }
      }

      // Format: "Kamis, 14 Mar 2024 14:30 WIB" atau "14 Mar 2024 14:30 WIB"
      const cleanStr = dateStr.replace("WIB", "").trim();
      let dateTime: string;
      
      if (cleanStr.includes(",")) {
        // Format dengan nama hari
        dateTime = cleanStr.split(", ")[1].trim();
      } else {
        // Format tanpa nama hari
        dateTime = cleanStr;
      }

      const parts = dateTime.split(" ").filter(part => part.length > 0);
      if (parts.length < 4) return new Date();

      const [day, month, year, time] = parts;
      if (!time) return new Date();

      const [hour, minute] = time.split(":");

      const months: Record<string, string> = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'Mei': '05', 'Jun': '06', 'Jul': '07', 'Agu': '08',
        'Sep': '09', 'Okt': '10', 'Nov': '11', 'Des': '12'
      };

      const monthNum = months[month] || '01';
      const dateString = `${year}-${monthNum}-${day.padStart(2, '0')}T${hour}:${minute}:00+07:00`;
      const parsedDate = new Date(dateString);
      
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    } catch (error) {
      console.error('Error parsing date:', error, 'Date string:', dateStr);
      return new Date();
    }
  }

  async getArticleDetail(url: string): Promise<ArticleDetail> {
    const $ = await this.fetchHtml(url);
    
    // Remove ads and non-content elements
    $('script').remove();
    $('.advertisement').remove();
    $('.scrollpage').remove();
    $('[id^=div-gpt-ad]').remove();
    $('.detail__body-tag').remove();
    $('.detail__footer').remove();
    
    const title = $('h1.detail__title, .detail__header h1').text().trim();
    const imageUrl = $('.detail__media-image img, .detail__media img').attr('src');
    const content = $('.detail__body-text p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(text => 
        text && 
        !text.includes('ADVERTISEMENT') && 
        !text.includes('Baca juga:') &&
        !text.includes('Baca Juga:')
      )
      .join('\n\n');
    const author = $('.detail__author, .detail__byline').text().trim();
    const category = $('.detail__category, .detail__label').text().trim();
    const dateStr = $('.detail__date, .detail__time').text().trim();

    // Only return if we have all required content
    if (title && imageUrl && content) {
      return {
        title,
        url,
        imageUrl,
        content,
        author,
        category,
        publishedAt: this.parseDate(dateStr),
        source: this.source
      };
    }
    throw new Error('Invalid article content');
  }
}