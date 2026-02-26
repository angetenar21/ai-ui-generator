import React from 'react';

interface ResponsiveComponentWrapperProps {
  children: React.ReactNode;
  maxWidth?: number;
}

const ResponsiveComponentWrapper: React.FC<ResponsiveComponentWrapperProps> = ({
  children,
  maxWidth,
}) => {
  // Fluid wrapper that doesn't restrict shadow bleed via overflow-hidden
  return (
    <div
      className="w-full relative"
      style={maxWidth ? { maxWidth: `${maxWidth}px`, margin: '0 auto' } : undefined}
    >
      <div className="w-full relative">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveComponentWrapper;