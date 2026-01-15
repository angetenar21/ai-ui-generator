import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  content: string;
  className?: string;
  [key: string]: any;
}

const Markdown: React.FC<MarkdownProps> = ({ content, className = '', ...props }) => (
  <div className={`card rounded-card p-6 my-4 ${className}`} {...props}>
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-display font-bold text-text-primary mb-4 mt-6">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-display font-bold text-text-primary mb-3 mt-5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold text-text-primary mb-2 mt-4">{children}</h3>,
          h4: ({ children }) => <h4 className="text-lg font-semibold text-text-primary mb-2 mt-3">{children}</h4>,
          p: ({ children }) => <p className="text-text-secondary mb-3 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-text-primary">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => <code className="bg-bg-surface px-1.5 py-0.5 rounded text-accent-cyan font-mono text-sm">{children}</code>,
          pre: ({ children }) => <pre className="bg-bg-surface rounded-lg p-4 overflow-x-auto my-3">{children}</pre>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-text-secondary">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-text-secondary">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-accent-from pl-4 italic my-3 text-text-tertiary">{children}</blockquote>,
          a: ({ href, children }) => <a href={href} className="text-accent-from hover:text-accent-to underline" target="_blank" rel="noopener noreferrer">{children}</a>,
          hr: () => <hr className="border-border-main my-4" />,
          table: ({ children }) => <table className="w-full border-collapse my-3">{children}</table>,
          th: ({ children }) => <th className="border border-border-main px-3 py-2 bg-bg-sub text-text-primary font-semibold text-left">{children}</th>,
          td: ({ children }) => <td className="border border-border-main px-3 py-2 text-text-secondary">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  </div>
);

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
