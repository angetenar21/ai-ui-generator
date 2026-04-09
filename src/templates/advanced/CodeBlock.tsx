import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  /** Code content to display */
  code: string;

  /** Programming language */
  language?: 'javascript' | 'typescript' | 'python' | 'java' | 'html' | 'css' | 'json' | 'bash' | 'sql' | 'other';

  /** Show line numbers */
  showLineNumbers?: boolean;

  /** Show copy button */
  showCopyButton?: boolean;

  /** Optional title/filename */
  title?: string;

  /** Maximum height (scrollable) */
  maxHeight?: number;

  /** Theme variant */
  theme?: 'dark' | 'light';

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'javascript',
  showLineNumbers = true,
  showCopyButton = true,
  title,
  maxHeight = 400,
  theme = 'dark',
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!code || code.trim() === '') {
    return (
      <div className="card border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 my-2">
        <div className="text-zinc-600 dark:text-zinc-400 text-sm">No code provided</div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const lines = code.split('\n');

  const languageColors: Record<string, string> = {
    javascript: 'text-yellow-600 dark:text-yellow-400',
    typescript: 'text-indigo-600 dark:text-indigo-400',
    python: 'text-green-600 dark:text-green-400',
    java: 'text-indigo-600 dark:text-indigo-400',
    html: 'text-pink-600 dark:text-pink-400',
    css: 'text-purple-600 dark:text-purple-400',
    json: 'text-indigo-600 dark:text-indigo-400',
    bash: 'text-zinc-600 dark:text-zinc-400',
    sql: 'text-red-600 dark:text-red-400',
    other: 'text-zinc-600 dark:text-zinc-400',
  };

  const themeClasses = {
    dark: 'bg-zinc-900 border-zinc-700',
    light: 'bg-zinc-50 border-zinc-200',
  };

  const themeTextClasses = {
    dark: 'text-zinc-300',
    light: 'text-zinc-900',
  };

  return (
    <div className={`${themeClasses[theme]} border rounded-lg my-2 overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/50">
        <div className="flex items-center gap-3">
          {title && (
            <span className="text-zinc-900 dark:text-white text-sm font-medium">{title}</span>
          )}
          <span className={`text-xs font-mono uppercase ${languageColors[language]}`}>
            {language}
          </span>
        </div>

        {showCopyButton && (
          <button
            onClick={handleCopy}
            className="
              flex items-center gap-1 px-2 py-1 rounded
              text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white
              hover:bg-white dark:bg-zinc-900 transition-colors
              text-sm
            "
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success" />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Code Content */}
      <div
        className="overflow-x-auto overflow-y-auto"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <pre className="p-4">
          <code className={`font-mono text-sm ${themeTextClasses[theme]}`}>
            {lines.map((line, index) => (
              <div key={index} className="flex">
                {showLineNumbers && (
                  <span className="text-zinc-600 dark:text-zinc-400 select-none w-8 flex-shrink-0 text-right mr-4">
                    {index + 1}
                  </span>
                )}
                <span className="flex-1">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Footer with line count */}
      <div className="px-4 py-1 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/30">
        <div className="text-zinc-600 dark:text-zinc-400 text-xs">
          {lines.length} {lines.length === 1 ? 'line' : 'lines'}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;

export const metadata = {
  name: 'code-block',
  category: 'advanced' as const,
  component: CodeBlock,
  description: 'Code block display with syntax highlighting, line numbers, and copy functionality',
  tags: ['code', 'syntax', 'programming', 'snippet', 'developer', 'monospace'],
  propTypes: {
    code: 'string (required) - Code content to display',
    language: 'string - Programming language: javascript, typescript, python, java, html, css, json, bash, sql, other (default: javascript)',
    showLineNumbers: 'boolean - Display line numbers (default: true)',
    showCopyButton: 'boolean - Show copy button (default: true)',
    title: 'string - Optional title or filename',
    maxHeight: 'number - Maximum height in pixels (default: 400)',
    theme: 'string - Color theme: dark, light (default: dark)',
  },
};
