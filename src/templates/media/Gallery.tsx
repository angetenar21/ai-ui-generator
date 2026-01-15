import React, { useState } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  variant?: 'grid' | 'masonry' | 'justified';
  lightbox?: boolean;
  showCaptions?: boolean;
  filterCategories?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  hoverEffect?: 'zoom' | 'fade' | 'lift' | 'none';
  className?: string;
  onImageClick?: (image: GalleryImage, index: number) => void;
}

const Gallery: React.FC<GalleryProps> = ({
  images,
  columns = 3,
  gap = 'md',
  variant = 'grid',
  lightbox = true,
  showCaptions = true,
  filterCategories = false,
  aspectRatio = '1:1',
  rounded = 'lg',
  hoverEffect = 'zoom',
  className = '',
  onImageClick,
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const categories = filterCategories
    ? ['all', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))]
    : [];

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  const handleImageClick = (image: GalleryImage, index: number) => {
    if (lightbox) {
      setSelectedImage(index);
    }
    if (onImageClick) {
      onImageClick(image, index);
    }
  };

  const handlePrevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
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
    auto: '',
  };

  const hoverEffectClasses = {
    zoom: 'hover:scale-110 transition-transform duration-300',
    fade: 'hover:opacity-75 transition-opacity duration-300',
    lift: 'hover:-translate-y-2 hover:shadow-2xl transition-all duration-300',
    none: '',
  };

  if (!images || images.length === 0) {
    return (
      <div className="glass-dark border border-gray-700/50 rounded-xl p-12 text-center">
        <svg className="w-20 h-20 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-400 text-lg">No images to display</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Category Filter */}
      {filterCategories && categories.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category || '')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }
              `.trim().replace(/\s+/g, ' ')}
            >
              {category ? category.charAt(0).toUpperCase() + category.slice(1) : ''}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <div
        className={`
          ${variant === 'grid' ? `grid ${columnClasses[columns]} ${gapClasses[gap]}` : ''}
          ${variant === 'masonry' ? `columns-${columns} ${gapClasses[gap]}` : ''}
          ${variant === 'justified' ? 'flex flex-wrap' : ''}
        `.trim().replace(/\s+/g, ' ')}
      >
        {filteredImages.map((image, index) => (
          <div
            key={index}
            className={`
              ${variant === 'masonry' ? 'break-inside-avoid mb-4' : ''}
              ${variant === 'justified' ? 'flex-grow' : ''}
              group cursor-pointer
            `.trim().replace(/\s+/g, ' ')}
            onClick={() => handleImageClick(image, index)}
          >
            <div
              className={`
                relative overflow-hidden bg-gray-900
                ${roundedClasses[rounded as keyof typeof roundedClasses] || roundedClasses.lg}
                ${variant === 'grid' ? aspectRatioClasses[aspectRatio] : ''}
              `.trim().replace(/\s+/g, ' ')}
            >
              {/* Loading Skeleton */}
              {!loadedImages.has(index) && (
                <div className="absolute inset-0 bg-gray-800/50 animate-pulse" />
              )}

              {/* Image */}
              <img
                src={image.thumbnail || image.src}
                alt={image.alt}
                onLoad={() => handleImageLoad(index)}
                className={`
                  w-full h-full object-cover
                  ${hoverEffectClasses[hoverEffect]}
                  ${!loadedImages.has(index) ? 'opacity-0' : 'opacity-100'}
                  transition-opacity duration-300
                `.trim().replace(/\s+/g, ' ')}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>

              {/* Caption */}
              {showCaptions && (image.title || image.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.title && (
                    <h3 className="text-white font-semibold text-sm mb-1">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-gray-300 text-xs line-clamp-2">{image.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightbox && selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Arrows */}
          {filteredImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt}
              className="max-w-full max-h-[90vh] object-contain"
            />

            {/* Image Info */}
            {(filteredImages[selectedImage].title || filteredImages[selectedImage].description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 backdrop-blur-sm">
                {filteredImages[selectedImage].title && (
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {filteredImages[selectedImage].title}
                  </h3>
                )}
                {filteredImages[selectedImage].description && (
                  <p className="text-gray-300 text-sm">
                    {filteredImages[selectedImage].description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
            {selectedImage + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

export const metadata = {
  name: 'gallery',
  category: 'media' as const,
  component: Gallery,
  description: 'Photo gallery component with grid/masonry/justified layouts, integrated lightbox modal, category filtering, hover effects, lazy loading, and responsive column layouts.',
  tags: ['ui', 'media', 'gallery', 'images', 'lightbox', 'grid'],
};
