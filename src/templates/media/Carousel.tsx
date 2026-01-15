import React, { useState, useEffect, useRef } from 'react';

interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
  link?: string;
}

interface CarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  showThumbnails?: boolean;
  infinite?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9' | 'auto';
  transition?: 'slide' | 'fade' | 'zoom';
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onSlideChange?: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoPlay = false,
  interval = 5000,
  showIndicators = true,
  showArrows = true,
  showThumbnails = false,
  infinite = true,
  aspectRatio = '16:9',
  transition = 'slide',
  rounded = 'lg',
  className = '',
  onSlideChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isAutoPlaying && !isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying, isPaused, interval]);

  const nextSlide = () => {
    const newIndex = currentIndex === images.length - 1
      ? (infinite ? 0 : currentIndex)
      : currentIndex + 1;

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      if (onSlideChange) onSlideChange(newIndex);
    }
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0
      ? (infinite ? images.length - 1 : currentIndex)
      : currentIndex - 1;

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      if (onSlideChange) onSlideChange(newIndex);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (onSlideChange) onSlideChange(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  const roundedClasses = {
    false: '',
    true: 'rounded-lg',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
    auto: '',
  };

  const transitionClasses = {
    slide: 'transition-transform duration-500 ease-in-out',
    fade: 'transition-opacity duration-500 ease-in-out',
    zoom: 'transition-all duration-500 ease-in-out',
  };

  if (!images || images.length === 0) {
    return (
      <div className="glass-dark border border-gray-700/50 rounded-xl p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-400">No images to display</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Carousel */}
      <div
        className={`
          relative overflow-hidden bg-black
          ${roundedClasses[rounded as keyof typeof roundedClasses] || roundedClasses.lg}
          ${aspectRatioClasses[aspectRatio]}
        `.trim().replace(/\s+/g, ' ')}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        <div className="relative w-full h-full">
          {images.map((image, index) => {
            const isActive = index === currentIndex;

            return (
              <div
                key={index}
                className={`
                  absolute inset-0
                  ${transitionClasses[transition]}
                  ${
                    transition === 'slide'
                      ? `${isActive ? 'translate-x-0' : index < currentIndex ? '-translate-x-full' : 'translate-x-full'}`
                      : transition === 'fade'
                      ? `${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`
                      : `${isActive ? 'scale-100 opacity-100 z-10' : 'scale-95 opacity-0 z-0'}`
                  }
                `.trim().replace(/\s+/g, ' ')}
              >
                {image.link ? (
                  <a href={image.link} className="block w-full h-full">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ) : (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Caption */}
                {image.caption && isActive && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white text-lg font-medium">{image.caption}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {showArrows && images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-20 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-20 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Indicators */}
        {showIndicators && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${currentIndex === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}
                `.trim().replace(/\s+/g, ' ')}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Auto-play Control */}
        {autoPlay && (
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors z-20 backdrop-blur-sm"
            aria-label={isAutoPlaying ? 'Pause autoplay' : 'Resume autoplay'}
          >
            {isAutoPlaying && !isPaused ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}

        {/* Counter */}
        <div className="absolute top-4 left-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm z-20">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                flex-shrink-0 w-20 h-16 rounded-md overflow-hidden transition-all
                ${currentIndex === index ? 'ring-2 ring-blue-500 opacity-100' : 'opacity-50 hover:opacity-75'}
              `.trim().replace(/\s+/g, ' ')}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;

export const metadata = {
  name: 'carousel',
  category: 'media' as const,
  component: Carousel,
  description: 'Image carousel/slider component with navigation arrows, indicators, thumbnails, auto-play functionality, touch/swipe support, and multiple transition effects including slide, fade, and zoom.',
  tags: ['ui', 'media', 'carousel', 'slider', 'images', 'gallery'],
};
