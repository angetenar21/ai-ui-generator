import React from 'react';

interface ResponsiveComponentWrapperProps {
  children: React.ReactNode;
  maxWidth?: number;
  alignLeft?: boolean;
}

const ResponsiveComponentWrapper: React.FC<ResponsiveComponentWrapperProps> = ({
  children,
  maxWidth,
  alignLeft = false,
}) => {
  // Fluid wrapper that doesn't restrict shadow bleed via overflow-hidden
  return (
    <div
      className={`w-full relative ${alignLeft ? 'flex justify-start' : ''}`}
      style={maxWidth ? { maxWidth: `${maxWidth}px`, margin: '0 auto' } : undefined}
    >
      <div className={`w-full relative ${alignLeft ? '[&>*:first-child]:!ml-0 [&>*:first-child]:!mr-auto' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveComponentWrapper;