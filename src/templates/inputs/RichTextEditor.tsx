import React, { useState, useRef } from 'react';

interface RichTextEditorProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  errorMessage?: string;
  minHeight?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  onChange?: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  defaultValue = '',
  placeholder = 'Start typing...',
  disabled = false,
  required = false,
  error = false,
  helperText,
  errorMessage,
  minHeight = '200px',
  maxHeight = '400px',
  showToolbar = true,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const editorRef = useRef<HTMLDivElement>(null);

  const displayValue = value !== undefined ? value : internalValue;

  const execCommand = (command: string, value?: string) => {
    if (disabled) return;
    document.execCommand(command, false, value);
    handleChange();
  };

  const handleChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setInternalValue(content);
      if (onChange) onChange(content);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const toolbarButtons = [
    { command: 'bold', icon: 'B', title: 'Bold', style: 'font-bold' },
    { command: 'italic', icon: 'I', title: 'Italic', style: 'italic' },
    { command: 'underline', icon: 'U', title: 'Underline', style: 'underline' },
    { command: 'strikeThrough', icon: 'S', title: 'Strikethrough', style: 'line-through' },
    { divider: true },
    { command: 'insertUnorderedList', icon: '•', title: 'Bullet List' },
    { command: 'insertOrderedList', icon: '1.', title: 'Numbered List' },
    { divider: true },
    { command: 'justifyLeft', icon: '≡', title: 'Align Left' },
    { command: 'justifyCenter', icon: '≡', title: 'Align Center' },
    { command: 'justifyRight', icon: '≡', title: 'Align Right' },
    { divider: true },
    { command: 'removeFormat', icon: '✕', title: 'Clear Formatting' },
  ];

  return (
    <div className="my-4 max-w-2xl">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div
        className={`
          border-2 rounded-lg overflow-hidden
          ${error ? 'border-red-500' : 'border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          transition-all duration-200
        `.trim().replace(/\s+/g, ' ')}
      >
        {showToolbar && (
          <div className="flex flex-wrap gap-1 p-2 bg-gray-800 border-b-2 border-gray-700">
            {toolbarButtons.map((btn, index) => {
              if (btn.divider) {
                return <div key={index} className="w-px h-8 bg-gray-600 mx-1" />;
              }
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => btn.command && execCommand(btn.command)}
                  disabled={disabled}
                  title={btn.title}
                  className={`
                    px-3 py-1.5 rounded text-sm font-medium
                    ${btn.style ? btn.style : ''}
                    text-gray-300 hover:bg-gray-700 hover:text-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-150
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `.trim().replace(/\s+/g, ' ')}
                >
                  {btn.icon}
                </button>
              );
            })}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleChange}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: displayValue }}
          className={`
            px-4 py-3 text-white bg-transparent
            focus:outline-none overflow-y-auto
            ${disabled ? 'cursor-not-allowed' : ''}
          `.trim().replace(/\s+/g, ' ')}
          style={{
            minHeight,
            maxHeight,
          }}
          data-placeholder={placeholder}
        />
        <style>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
          [contenteditable] {
            outline: none;
          }
          [contenteditable] ul,
          [contenteditable] ol {
            padding-left: 2rem;
            margin: 0.5rem 0;
          }
          [contenteditable] p {
            margin: 0.5rem 0;
          }
        `}</style>
      </div>
      {(helperText || (error && errorMessage)) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error && errorMessage ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default RichTextEditor;

export const metadata = {
  name: 'rich-text-editor',
  category: 'inputs' as const,
  component: RichTextEditor,
  description: 'Rich text editor with formatting toolbar, text alignment, lists, and basic styling options. Supports HTML content.',
  tags: ['ui', 'input', 'form', 'editor', 'richtext', 'wysiwyg'],
};
