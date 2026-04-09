import React, { useState, useEffect } from 'react';

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

  // Check if this is a map-related image
  const isMapImage = alt?.toLowerCase().includes('map') ||
    src?.toLowerCase().includes('map') ||
    caption?.toLowerCase().includes('map');

  // Fast, curated beautiful Unsplash fallbacks mapped by category
  const getFallbackImage = (query: string) => {
    const q = (query || '').toLowerCase();
    
    // Dictionary of pre-selected highly relevant images
    const placeholders: Record<string, string[]> = {
      food: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
        'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
        'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9'
      ],
      portrait: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', // man
        'https://images.unsplash.com/photo-1580489944761-15a19d654956', // woman
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12', // man
      ],
      product: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', // headphones
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30', // watch
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff', // shoes
      ],
      nature: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
      ],
      technology: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085', // code/laptop
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', // setup
      ],
      city: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
      ],
      map: [
        'https://images.unsplash.com/photo-1524661135-423995f22d0b', // map graphic
        'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83', // map pin
      ],
      abstract: [
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d',
        'https://images.unsplash.com/photo-1574169208507-84376144848b'
      ]
    };
    
    let category = 'abstract';
    
    // Smart keyword matching for apt results
    if (q.match(/recipe|food|dinner|lunch|breakfast|spagheti|spaghetti|carbonara|eat|meal|restaurant|pizza|burger|salad/)) category = 'food';
    else if (q.match(/user|profile|avatar|person|man|woman|people/)) category = 'portrait';
    else if (q.match(/product|shoe|watch|headphone|item|cart|shop/)) category = 'product';
    else if (q.match(/map|location|geo|route/)) category = 'map';
    else if (q.match(/city|street|building|urban/)) category = 'city';
    else if (q.match(/tech|computer|laptop|code|software|app/)) category = 'technology';
    else if (q.match(/nature|mountain|tree|forest|ocean|water|landscape/)) category = 'nature';
    
    const possibleImages = placeholders[category];
    // Deterministic selection based on query length so the same component gets the same image consistently
    const index = q.length % possibleImages.length;
    
    return `${possibleImages[index]}?auto=format&fit=crop&w=800&q=80`;
  };

  // Assign the optimized default fallback based on alt/caption text
  const defaultFallback = getFallbackImage(isMapImage ? 'map visualization' : alt);

  const [currentSrc, setCurrentSrc] = useState(src);
  const [isZoomed, setIsZoomed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
    setFallbackFailed(false);
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
    setCurrentSrc(fallbackSrc || defaultFallback);
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
        {/* Loading Skeleton */}
        {isLoading && (
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

        {/* Image */}
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
