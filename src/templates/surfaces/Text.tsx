import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useData, resolveVariables } from '../core/DataContext';

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

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Text: React.FC<TextProps> = ({
  content,
  variant = 'body',
  color = 'secondary',
  align = 'left',
  markdown = false,
}) => {
  const { data } = useData();

  // console.log('[Text] Rendering with content:', content);
  // console.log('[Text] Available data:', data);

  // Resolve any variables in the content (e.g. {user.name})
  const resolvedContent = resolveVariables(content, data);

  // console.log('[Text] Resolved content:', resolvedContent);

  const variantClasses = {
    heading: 'text-2xl font-display font-semibold leading-tight',
    subtitle: 'text-lg font-semibold',
    body: 'text-base',
    caption: 'text-sm',
  };

  const colorClasses = {
    primary: 'text-zinc-900 dark:text-zinc-100',
    secondary: 'text-zinc-600 dark:text-zinc-400',
    muted: 'text-zinc-500 dark:text-zinc-500',
    accent: 'text-indigo-500 dark:text-indigo-400',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // VISUAL DEBUGGING: Show error if variables match failed
  const showDebug = typeof resolvedContent === 'string' && resolvedContent.includes('{') && resolvedContent.includes('}');

  const commonClasses = `${variantClasses[variant]} ${colorClasses[color]} ${alignClasses[align]} leading-relaxed`;

  if (showDebug) {
    return (
      <div className="w-full">
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200 mb-2 font-mono break-all">
          <strong>DEBUG:</strong> Unresolved: {resolvedContent}
        </div>
      </div>
    );
  }

  if (markdown) {
    return (
      <div className={`${commonClasses} prose dark:prose-invert max-w-none`}>
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-100 mb-4 mt-6">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-100 mb-3 mt-5">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2 mt-4">{children}</h3>,
            h4: ({ children }) => <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 mt-3">{children}</h4>,
            p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
            strong: ({ children }) => <strong className="font-bold text-zinc-900 dark:text-zinc-100">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => <code className="bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono text-sm">{children}</code>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-3">{children}</blockquote>,
            a: ({ href, children }) => <a href={href} className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
          }}
        >
          {resolvedContent}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <p className={`${commonClasses} whitespace-pre-wrap`}>
      {resolvedContent}
    </p>
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
