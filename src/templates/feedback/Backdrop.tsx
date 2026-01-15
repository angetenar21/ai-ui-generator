import React, { useState, useEffect } from 'react';

interface BackdropProps {
  open?: boolean;
  isOpen?: boolean;
  visible?: boolean;
  opacity?: number;
  blur?: boolean;
  blurAmount?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
  content?: string;
  message?: string;
}

const Backdrop: React.FC<BackdropProps> = ({
  open = true,
  isOpen,
  visible,
  opacity = 0.6,
  blur = true,
  blurAmount = 'sm',
  onClick,
  onClose,
  children,
  content,
  message,
}) => {
  const [isVisible, setIsVisible] = useState(open || isOpen || visible || false);

  useEffect(() => {
    const shouldShow = open || isOpen || visible;
    setIsVisible(shouldShow !== undefined ? shouldShow : true);
  }, [open, isOpen, visible]);

  const handleClick = () => {
    if (onClick) onClick();
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const blurClasses = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const displayContent = content || message;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center ${blur ? blurClasses[blurAmount] : ''}`}
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
      onClick={handleClick}
    >
      {children && (
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
      {displayContent && !children && (
        <div className="text-white text-center" onClick={(e) => e.stopPropagation()}>
          <div className="text-lg">{displayContent}</div>
        </div>
      )}
    </div>
  );
};

export default Backdrop;

export const metadata = {
  name: 'backdrop',
  category: 'feedback' as const,
  component: Backdrop,
  description: 'Backdrop overlay component for modals and dialogs. Provides a darkened, optionally blurred background layer with customizable opacity.',
  tags: ['ui', 'feedback', 'backdrop', 'overlay', 'modal', 'background'],
};
