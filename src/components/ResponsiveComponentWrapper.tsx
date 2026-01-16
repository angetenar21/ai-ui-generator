import React from 'react';

interface ResponsiveComponentWrapperProps {
  children: React.ReactNode;
  maxWidth?: number;
}

const ResponsiveComponentWrapper: React.FC<ResponsiveComponentWrapperProps> = ({
  children,
  maxWidth = 900,
}) => {
  // Simple wrapper that constrains content without scaling
  // This prevents layout issues from transform scaling
  return (
    <div
      className="w-full max-w-full overflow-hidden"
      style={{
        maxWidth: `${maxWidth}px`,
      }}
    >
      <div className="w-full max-w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveComponentWrapper;