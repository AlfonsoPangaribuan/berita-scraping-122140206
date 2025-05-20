export interface Article {
  title: string;
  url: string;
  imageUrl?: string;
  description?: string;
  publishedAt: Date;
  source: 'kompas' | 'detik' | 'tempo';
}

export interface ArticleDetail extends Article {
  content: string;
  author?: string;
  category?: string;
}