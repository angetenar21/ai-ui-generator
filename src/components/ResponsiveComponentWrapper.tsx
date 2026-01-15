import React, { useRef, useEffect, useState } from 'react';

interface ResponsiveComponentWrapperProps {
  children: React.ReactNode;
  maxWidth?: number;
  // Removed maxHeight since we want to allow vertical overflow
}

const ResponsiveComponentWrapper: React.FC<ResponsiveComponentWrapperProps> = ({
  children,
  maxWidth = 1200,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !contentRef.current) return;

      const container = containerRef.current;
      const content = contentRef.current;

      // Get container width
      const containerWidth = container.clientWidth;

      // Reset scale to measure natural size
      content.style.transform = 'scale(1)';

      // Measure content natural width
      const contentWidth = content.scrollWidth;

      // Calculate scale factor only for width
      let scaleX = 1;

      if (contentWidth > containerWidth) {
        scaleX = containerWidth / contentWidth;
      }

      // Only scale if content is wider than container
      const finalScale = Math.min(scaleX, 1);
      
      setScale(finalScale);
      content.style.transform = `scale(${finalScale})`;
      content.style.transformOrigin = 'top left';

      // Don't adjust container height - let it flow naturally
    };

    // Calculate on mount and resize
    calculateScale();
    
    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', calculateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateScale);
    };
  }, [maxWidth]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden"
      style={{
        maxWidth: `${maxWidth}px`,
        position: 'relative'
      }}
    >
      <div
        ref={contentRef}
        className="transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '100%',
          maxWidth: `${maxWidth}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ResponsiveComponentWrapper;