import React, { useState, useEffect, useRef } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fallbackSrc?: string;
  lazyLoad?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  rounded?: boolean | 'full' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  zoom?: boolean;
  overlay?: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9' | 'auto';
  grayscale?: boolean;
  blur?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  onClick?: () => void;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

// ─── Image Resolution Helpers ────────────────────────────────────────────────

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000';

// In-memory client-side cache to avoid duplicate network calls
const resolvedImageCache = new Map<string, string>();

/**
 * Detect `@img:keyword1,keyword2` format and resolve to a real image URL
 * via the backend proxy (which calls Pexels API).
 */
async function resolveImageSrc(src: string): Promise<string> {
  // Not an @img: reference — return as-is
  if (!src.startsWith('@img:')) {
    return src;
  }

  const keywords = src.slice(5).trim(); // Strip "@img:" prefix
  if (!keywords) return src;

  // Check client cache
  const cacheKey = keywords.toLowerCase();
  const cached = resolvedImageCache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE_URL}/api/image-proxy?q=${encodeURIComponent(keywords)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        resolvedImageCache.set(cacheKey, data.url);
        return data.url;
      }
    }
  } catch (err) {
    console.warn('[Image] Failed to resolve @img: src, using fallback', err);
  }

  // Fallback: deterministic picsum seed from keywords
  const hash = simpleHash(cacheKey);
  const fallback = `https://picsum.photos/seed/${hash}/800/600`;
  resolvedImageCache.set(cacheKey, fallback);
  return fallback;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generate a deterministic fallback URL from the alt text.
 * Uses picsum.photos with a seeded hash for consistent, beautiful stock photos.
 */
function getFallbackImage(alt: string): string {
  const seed = simpleHash((alt || 'abstract').toLowerCase());
  return `https://picsum.photos/seed/${seed}/800/600`;
}


// ─── Image Component ─────────────────────────────────────────────────────────

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  fallbackSrc,
  lazyLoad = true,
  objectFit = 'cover',
  rounded = 'md',
  border = false,
  shadow = false,
  zoom = false,
  overlay,
  caption,
  aspectRatio = 'auto',
  grayscale = false,
  blur = false,
  className = '',
  onLoad,
  onError,
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const mountedRef = useRef(true);

  // Check if this is a map-related image
  const isMapImage = alt?.toLowerCase().includes('map') ||
    src?.toLowerCase().includes('map') ||
    caption?.toLowerCase().includes('map');

  const defaultFallback = fallbackSrc || getFallbackImage(isMapImage ? 'map visualization' : alt);

  // Resolve @img: sources on mount or src change
  useEffect(() => {
    mountedRef.current = true;
    setIsLoading(true);
    setHasError(false);
    setFallbackFailed(false);

    if (src?.startsWith('@img:')) {
      setIsResolving(true);
      resolveImageSrc(src).then((resolvedUrl) => {
        if (mountedRef.current) {
          setCurrentSrc(resolvedUrl);
          setIsResolving(false);
        }
      });
    } else {
      setCurrentSrc(src);
      setIsResolving(false);
    }

    return () => { mountedRef.current = false; };
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    if (hasError) {
      setFallbackFailed(true);
      setIsLoading(false);
      return;
    }
    
    // Switch to fallback source and restart loading state
    setIsLoading(true);
    setHasError(true);
    setCurrentSrc(defaultFallback);
    if (onError) onError();
  };

  const handleClick = () => {
    if (zoom) {
      setIsZoomed(!isZoomed);
    }
    if (onClick) onClick();
  };

  const roundedClasses = {
    false: '',
    true: 'rounded-lg',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const shadowClasses = {
    false: '',
    true: 'shadow-lg',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const objectFitClasses = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
    auto: '',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          relative overflow-hidden
          ${roundedClasses[rounded as keyof typeof roundedClasses] || roundedClasses.md}
          ${shadowClasses[shadow as keyof typeof shadowClasses] || ''}
          ${border ? 'border-2 border-zinc-700' : ''}
          ${aspectRatioClasses[aspectRatio]}
          ${zoom ? 'cursor-zoom-in' : onClick ? 'cursor-pointer' : ''}
        `.trim().replace(/\s+/g, ' ')}
        style={{ width, height: aspectRatio === 'auto' ? height : undefined }}
        onClick={handleClick}
      >
        {/* Loading Skeleton — shows while resolving @img: or loading */}
        {(isLoading || isResolving) && (
          <div className="absolute inset-0 bg-zinc-800/50 animate-pulse flex items-center justify-center">
            <svg
              className="w-12 h-12 text-zinc-600 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        {/* Image — only render once we have a resolved URL */}
        {currentSrc && !isResolving && (
          <img
            src={currentSrc}
            alt={alt}
            loading={lazyLoad ? 'lazy' : 'eager'}
            onLoad={handleLoad}
            onError={handleError}
            className={`
              w-full h-full
              ${objectFitClasses[objectFit]}
              ${grayscale ? 'grayscale' : ''}
              ${blur ? 'blur-sm' : ''}
              ${zoom && !isZoomed ? 'transition-transform duration-300 hover:scale-105' : ''}
              ${isLoading ? 'opacity-0' : 'opacity-100'}
              transition-opacity duration-300
            `.trim().replace(/\s+/g, ' ')}
          />
        )}

        {/* Overlay */}
        {overlay && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-lg font-medium px-4 py-2 backdrop-blur-sm rounded-lg">
              {overlay}
            </span>
          </div>
        )}

        {/* Error State */}
        {fallbackFailed && (
          <div className="absolute inset-0 bg-zinc-900/90 dark:bg-zinc-800/90 flex flex-col items-center justify-center p-4">
            <div className="text-center text-zinc-400 dark:text-zinc-500">
              <svg
                className="w-16 h-16 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-medium mb-1">
                {isMapImage ? 'Map visualization unavailable' : 'Image unavailable'}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-600">
                {isMapImage ? 'Using placeholder map' : 'Using placeholder image'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p className="mt-2 text-sm text-zinc-400 text-center">{caption}</p>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={currentSrc}
            alt={alt}
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white hover:text-zinc-300 transition-colors"
            onClick={() => setIsZoomed(false)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Image;

export const metadata = {
  name: 'image',
  category: 'media' as const,
  component: Image,
  description: 'Image display component with lazy loading, fallback support, zoom functionality, loading states, and various styling options including aspect ratios, borders, shadows, and filters.',
  tags: ['ui', 'media', 'image', 'lazy-load', 'responsive'],
};
