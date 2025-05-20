'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import type { ArticleDetail } from '@/types/news';

export default function ArticlePage({
  params,
}: {
  params: { source: 'cnn' | 'detik' | 'liputan6'; slug: string[] };
}) {
  const unwrappedParams = use(params);
  const [article, setArticle] = useState<ArticleDetail>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/news/${unwrappedParams.source}/${unwrappedParams.slug.join('/')}`);
        if (!response.ok) throw new Error('Gagal mengambil artikel');
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError('Gagal memuat artikel');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [unwrappedParams.source, unwrappedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <p className="text-xl text-red-600">{error || 'Artikel tidak ditemukan'}</p>
          <button 
            onClick={() => router.push('/news')} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 lg:p-12">
        <button
          onClick={() => router.push('/news')}
          className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </button>
        
        <h1 className="text-4xl font-bold mb-6 text-gray-800">{article.title}</h1>
        
        {article.imageUrl && (
          <div className="relative overflow-hidden rounded-xl mb-8">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Penulis: {article.author || 'Anonim'}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Kategori: {article.category}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
        
        <div className="prose max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}