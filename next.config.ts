import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'www.kompas.com',
      'www.detik.com',
      'www.tempo.co',
      'lh3.googleusercontent.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.kompas.com'
      },
      {
        protocol: 'https',
        hostname: '**.detik.com'
      },
      {
        protocol: 'https',
        hostname: '**.tempo.co'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' }, // Update this
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ];
  }
};

export default nextConfig;