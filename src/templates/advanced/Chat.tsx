import React from 'react';
import { Send, User, Bot } from 'lucide-react';

interface Message {
  /** Message text */
  text: string;

  /** Sender: user or bot */
  sender: 'user' | 'bot' | 'system';

  /** Timestamp */
  timestamp?: string;

  /** Sender's name */
  name?: string;

  /** Avatar URL */
  avatar?: string;
}

interface ChatProps {
  /** Array of messages */
  messages: Message[];

  /** Chat title */
  title?: string;

  /** Show input field */
  showInput?: boolean;

  /** Input placeholder */
  inputPlaceholder?: string;

  /** Max height for scrollable area */
  maxHeight?: number;

  children?: React.ReactNode;
  renderChild?: (child: any) => React.ReactNode;
}

const Chat: React.FC<ChatProps> = ({
  messages = [],
  title,
  showInput = true,
  inputPlaceholder = 'Type a message...',
  maxHeight = 500,
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Validate messages array
  if (!Array.isArray(messages)) {
    console.error('[Chat] Invalid messages prop - expected array, got:', typeof messages);
    return (
      <div className="card border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl p-6 my-2 shadow-sm">
        <div className="text-zinc-600 dark:text-zinc-400 text-sm">
          <div className="text-yellow-600 dark:text-yellow-500 font-semibold mb-2">⚠️ Configuration Error</div>
          <div>Invalid messages data. Expected an array of message objects.</div>
        </div>
      </div>
    );
  }

  // Filter out invalid messages
  const validMessages = messages.filter(msg => msg && typeof msg === 'object' && msg.text);

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log('Message sent:', inputValue);
      setInputValue('');
    }
  };

  const getMessageAlignment = (sender: string) => {
    return sender === 'user' ? 'justify-end' : 'justify-start';
  };

  const getMessageBg = (sender: string) => {
    if (sender === 'user') return 'bg-orange-500 dark:bg-orange-500 text-white';
    if (sender === 'system') return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-center';
    return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white';
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="card border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl my-2 overflow-hidden flex flex-col w-full max-w-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
      {/* Header */}
      {title && (
        <div className="px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-50/80 dark:bg-zinc-800/50">
          <h3 className="text-zinc-900 dark:text-white font-display font-semibold tracking-tight">{title}</h3>
        </div>
      )}

      {/* Messages Area */}
      <div
        className="overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {validMessages.length === 0 ? (
          <div className="text-zinc-600 dark:text-zinc-400 text-sm text-center py-8">
            <div className="mb-2">💬</div>
            <div>No messages yet</div>
            {messages.length > 0 && validMessages.length === 0 && (
              <div className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                {messages.length} invalid message(s) filtered out
              </div>
            )}
          </div>
        ) : (
          validMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${getMessageAlignment(message.sender)}`}
            >
              <div className="flex gap-2 max-w-[80%]">
                {/* Avatar */}
                {message.sender !== 'system' && message.sender !== 'user' && (
                  <div className="flex-shrink-0">
                    {message.avatar ? (
                      <img
                        src={message.avatar}
                        alt={message.name || 'Avatar'}
                        className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-zinc-900 shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-sm">
                        {message.sender === 'bot' ? (
                          <Bot className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        ) : (
                          <User className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Content */}
                <div className="flex flex-col gap-1">
                  {message.name && message.sender !== 'system' && (
                    <div className="text-zinc-600 dark:text-zinc-400 text-xs px-1">
                      {message.name}
                    </div>
                  )}

                  <div
                    className={`
                      ${getMessageBg(message.sender)}
                      px-4 py-3
                      ${message.sender === 'user' ? 'rounded-2xl rounded-br-md' : ''}
                      ${message.sender === 'bot' ? 'rounded-2xl rounded-bl-md' : ''}
                      ${message.sender === 'system' ? 'rounded-2xl text-xs italic' : ''}
                    `}
                  >
                    {message.text}
                  </div>

                  {message.timestamp && message.sender !== 'system' && (
                    <div className="text-zinc-600 dark:text-zinc-400 text-xs px-1">
                      {formatTimestamp(message.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {showInput && (
        <div className="px-4 py-3 border-t border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-50/80 dark:bg-zinc-800/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={inputPlaceholder}
              className="
                flex-1 px-4 py-2.5 rounded-xl
                bg-white dark:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-600
                text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500
                focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500
                transition-all duration-300
              "
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="
                px-4 py-2.5 rounded-full
                bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600
                text-white font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300 shadow-sm hover:shadow-md
              "
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

export const metadata = {
  name: 'chat',
  category: 'advanced' as const,
  component: Chat,
  description: 'Chat interface with messages, avatars, timestamps, and input field',
  tags: ['chat', 'messaging', 'conversation', 'messages', 'communication'],
  propTypes: {
    messages: 'array (required) - Array of message objects with text, sender, timestamp, name, and avatar',
    title: 'string - Optional chat title',
    showInput: 'boolean - Show message input field (default: true)',
    inputPlaceholder: 'string - Input field placeholder (default: "Type a message...")',
    maxHeight: 'number - Maximum height for scrollable area in pixels (default: 500)',
  },
};
