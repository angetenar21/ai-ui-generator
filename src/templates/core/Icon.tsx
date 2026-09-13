import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
  className?: string;
}

const DynamicIcon: React.FC<IconProps> = ({ name, size = 24, className, ...props }) => {
  // Convert kebab-case to PascalCase (e.g. "arrow-right" -> "ArrowRight")
  const pascalCaseName = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  // Check for direct match or PascalCase match
  // @ts-ignore - LucideIcons is a namespace with many exports
  const IconComponent = LucideIcons[name] || LucideIcons[pascalCaseName];

  if (!IconComponent) {
    // Fallback? Or just return null?
    // User reported "play" text appearing. We should return null to avoid ugly text.
    // Or maybe a generic fallback icon?
    return null;
  }

  return <IconComponent size={size} className={className} {...props} />;
};

export default DynamicIcon;
