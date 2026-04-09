import React, { useState, useEffect } from 'react';

interface MarkdownProps {
  content: string;
  className?: string;
  [key: string]: any;
}

const Markdown: React.FC<MarkdownProps> = ({ content, className = '', ...props }) => {
  const [ReactMarkdown, setReactMarkdown] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically import react-markdown
    import('react-markdown')
      .then((mod) => {
        setReactMarkdown(() => mod.default || mod);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={`card rounded-card p-6 my-4 ${className}`} {...props}>
        <div className="prose prose-invert max-w-none">
          <div className="text-zinc-600 dark:text-zinc-300">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Fallback if react-markdown is not available
  if (!ReactMarkdown) {
    return (
      <div className={`card rounded-card p-6 my-4 ${className}`} {...props}>
        <div className="prose prose-invert max-w-none">
          <div className="text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card rounded-card p-6 my-4 ${className}`} {...props}>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white mb-4 mt-6">{children}</h1>,
            h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white mb-3 mt-5">{children}</h2>,
            h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 mt-4">{children}</h3>,
            h4: ({ children }: { children?: React.ReactNode }) => <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 mt-3">{children}</h4>,
            p: ({ children }: { children?: React.ReactNode }) => <p className="text-zinc-600 dark:text-zinc-300 mb-3 leading-relaxed">{children}</p>,
            strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold text-zinc-900 dark:text-white">{children}</strong>,
            em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
            code: ({ children }: { children?: React.ReactNode }) => <code className="bg-zinc-50 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-indigo-500 font-mono text-sm">{children}</code>,
            pre: ({ children }: { children?: React.ReactNode }) => <pre className="bg-zinc-50 dark:bg-zinc-700 rounded-lg p-4 overflow-x-auto my-3">{children}</pre>,
            ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc list-inside mb-3 space-y-1 text-zinc-600 dark:text-zinc-300">{children}</ul>,
            ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-zinc-600 dark:text-zinc-300">{children}</ol>,
            li: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
            blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote className="border-l-4 border-accent-from pl-4 italic my-3 text-zinc-600 dark:text-zinc-400">{children}</blockquote>,
            a: ({ href, children }: { href?: string; children?: React.ReactNode }) => <a href={href} className="text-accent-from hover:text-accent-to underline" target="_blank" rel="noopener noreferrer">{children}</a>,
            hr: () => <hr className="border-zinc-200 dark:border-zinc-700 my-4" />,
            table: ({ children }: { children?: React.ReactNode }) => <table className="w-full border-collapse my-3">{children}</table>,
            th: ({ children }: { children?: React.ReactNode }) => <th className="border border-zinc-200 dark:border-zinc-700 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold text-left">{children}</th>,
            td: ({ children }: { children?: React.ReactNode }) => <td className="border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-zinc-600 dark:text-zinc-300">{children}</td>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Markdown;

export const metadata = {
  name: 'markdown',
  category: 'advanced' as const,
  component: Markdown,
  description: 'Full-featured markdown renderer with support for headings, lists, tables, code blocks, and more',
  tags: ['markdown', 'text', 'content', 'documentation'],
  propTypes: {
    content: 'string (required) - Markdown content to render',
    className: 'string - Additional CSS classes',
  },
  examples: [
    {
      name: 'Rich markdown content',
      props: {
        content: '# Welcome\n\nThis is **bold** and *italic* text.\n\n- List item 1\n- List item 2\n\n```js\nconst hello = "world";\n```',
      },
    },
  ],
};
