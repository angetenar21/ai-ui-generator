import React from 'react';
import ReactMarkdown from 'react-markdown';

interface TextProps {
  /** Text content to display */
  content: string;

  /** Visual variant */
  variant?: 'body' | 'caption' | 'subtitle' | 'heading';

  /** Color variant */
  color?: 'primary' | 'secondary' | 'muted' | 'accent';

  /** Text alignment */
  align?: 'left' | 'center' | 'right';

  /** Enable markdown-style formatting */
  markdown?: boolean;
}

const Text: React.FC<TextProps> = ({
  content,
  variant = 'body',
  color = 'secondary',
  align = 'left',
  markdown = false,
}) => {
  const variantClasses = {
    heading: 'text-2xl font-display font-semibold leading-tight',
    subtitle: 'text-lg font-semibold',
    body: 'text-base',
    caption: 'text-sm',
  };

  const colorClasses = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    muted: 'text-text-tertiary',
    accent: 'text-primary-500',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Detect if it's a section header (h2)
  const isSectionHeader = markdown && content.trim().startsWith('##');
  const containerClasses = isSectionHeader
    ? "p-2 my-1"  // Minimal padding for headers
    : "card rounded-card p-6 my-4";  // Normal padding for content

  return (
    <div className={containerClasses}>
      {markdown ? (
        <div className={`${variantClasses[variant]} ${colorClasses[color]} ${alignClasses[align]} leading-relaxed prose prose-invert max-w-none`}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-display font-bold text-text-primary mb-4 mt-6">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-display font-bold text-text-primary mb-3 mt-5">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-semibold text-text-primary mb-2 mt-4">{children}</h3>,
              h4: ({ children }) => <h4 className="text-lg font-semibold text-text-primary mb-2 mt-3">{children}</h4>,
              p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
              strong: ({ children }) => <strong className="font-bold text-text-primary">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => <code className="bg-bg-surface px-1.5 py-0.5 rounded text-accent-cyan font-mono text-sm">{children}</code>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-accent-from pl-4 italic my-3">{children}</blockquote>,
              a: ({ href, children }) => <a href={href} className="text-accent-from hover:text-accent-to underline" target="_blank" rel="noopener noreferrer">{children}</a>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <p className={`${variantClasses[variant]} ${colorClasses[color]} ${alignClasses[align]} leading-relaxed whitespace-pre-wrap`}>
          {content}
        </p>
      )}
    </div>
  );
};

export default Text;

// Component metadata for auto-registration
export const metadata = {
  name: 'text',
  category: 'surfaces' as const,
  component: Text,
  description: 'Text component for displaying explanations, descriptions, and narrative content',
  tags: ['text', 'typography', 'content', 'explanation'],
  propTypes: {
    content: 'string (required)',
    variant: '"body" | "caption" | "subtitle" | "heading"',
    color: '"primary" | "secondary" | "muted" | "accent"',
    align: '"left" | "center" | "right"',
    markdown: 'boolean',
  },
  examples: [
    {
      name: 'Simple explanation',
      props: {
        content: 'This chart shows the network traffic over the last 24 hours. The peak occurred at 3 PM with 445 million bytes transferred.',
      },
    },
    {
      name: 'With markdown',
      props: {
        content: 'The system detected **3 anomalies** in the last hour. Check the *error logs* for more details.',
        markdown: true,
      },
    },
  ],
};
