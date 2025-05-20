'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className="bg-gradient-to-r from-blue-500/90 via-blue-400/90 to-indigo-500/90 backdrop-blur-sm shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-white/90 hover:text-white transition-colors">
              Berita Indo
            </Link>
            <nav className="ml-6 space-x-4">
              <Link href="/news" className="text-white/80 hover:text-white transition-colors font-medium">
                Terbaru
              </Link>
            </nav>
          </div>
          
          <div>
            {isLoading ? (
              <div className="h-8 w-24 bg-white/10 rounded animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full ring-1 ring-white/30"
                    />
                  )}
                  <span className="text-sm font-medium text-white/90">
                    {session.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-white/80 hover:text-white transition-colors font-medium px-3 py-1 rounded-full border border-white/20 hover:border-white/40"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-blue-600 bg-white/90 hover:bg-white transition-colors focus:outline-none focus:ring-1 focus:ring-white/50 focus:ring-offset-1 focus:ring-offset-blue-400"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}