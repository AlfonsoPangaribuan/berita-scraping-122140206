'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Article } from '@/types/news';

export default function NewsPage() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Gagal mengambil berita');
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError('Gagal memuat berita');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <p className="text-xl text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 pb-12"> {/* Menambahkan padding top dan bottom */}
      <div className="container mx-auto px-6"> {/* Menambahkan padding kanan dan kiri */}
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 hover:text-blue-600 transition-colors">
          Berita Terkini
        </h1>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {news.map((article, index) => (
            <div
              key={`${article.source}-${article.url}-${index}`}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => router.push(`/news/${article.source}/${encodeURIComponent(article.url)}`)}
            >
              {article.imageUrl && (
                <div className="relative overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                {article.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="capitalize bg-blue-100 px-2 py-1 rounded-full">{article.source}</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}