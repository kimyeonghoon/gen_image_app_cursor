import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화 설정
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'], // OpenAI DALL-E 이미지 도메인
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 성능 최적화
  experimental: {
    optimizePackageImports: ['@/components', '@/utils'],
  },
  
  // 보안 헤더
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // 환경별 설정
  env: {
    CUSTOM_KEY: process.env.NODE_ENV === 'production' ? 'production_value' : 'development_value',
  },
  
  // 빌드 최적화
  compress: true,
  
  // 타입스크립트 설정
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
