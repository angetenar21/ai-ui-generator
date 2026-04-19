import React, { useEffect, useState } from 'react';
import DummyAppBackground from '../../components/DummyAppBackground';

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
  const [isVisible, setIsVisible] = useState(Boolean(open ?? isOpen ?? visible ?? true));

  useEffect(() => {
    const shouldShow = open ?? isOpen ?? visible ?? true;
    setIsVisible(Boolean(shouldShow));
  }, [open, isOpen, visible]);

  const handleClick = () => {
    if (onClick) onClick();
    if (onClose) onClose();
  };

  const blurClasses: Record<string, string> = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const displayContent = content || message;
  const blurClass = blur ? (blurClasses[blurAmount] || '') : '';

  // Inline preview mode: if no children and no content, show a visual placeholder
  if (!children && !displayContent) {
    return (
      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 my-4">
        <DummyAppBackground />
        <div
          className={`absolute inset-0 flex items-center justify-center ${blurClass} rounded-xl`}
          style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
        >
          <p className="text-white text-sm font-medium tracking-wide opacity-70">Backdrop Overlay (Preview)</p>
        </div>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl min-h-[300px] border border-zinc-200 dark:border-zinc-800">
        <DummyAppBackground />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl min-h-[300px] border border-zinc-200 dark:border-zinc-800">
      <DummyAppBackground />
      <div
        className={`absolute inset-0 z-40 flex items-center justify-center ${blurClass}`}
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
