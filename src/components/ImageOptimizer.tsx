'use client';

import { useState, useRef, useEffect } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (error: unknown) => void;
}

export default function ImageOptimizer({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  onLoad,
  onError
}: ImageOptimizerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = (error: unknown) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(error);
  };

  // 에러 발생 시 fallback 이미지 사용
  const handleFallback = () => {
    // 외부 이미지 URL인 경우 직접 표시 시도
    if (src.startsWith('http')) {
      setImageSrc(src);
      setHasError(false);
      setIsLoading(true);
    } else {
      setImageSrc('/placeholder-image.svg');
      setHasError(false);
      setIsLoading(true);
    }
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <div className="text-gray-400 text-4xl mb-2">🖼️</div>
          <p className="text-sm text-gray-600 mb-2">이미지를 불러올 수 없습니다</p>
          <button
            onClick={handleFallback}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-20">
          <div className="text-center">
            <svg className="animate-spin h-6 w-6 text-gray-400 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs text-gray-500">로딩 중...</span>
          </div>
        </div>
      )}

      {/* 최적화된 이미지 - z-index 조정으로 가시성 향상 */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 relative z-10 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
