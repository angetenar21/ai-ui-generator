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

  if (!Array.isArray(messages)) {
    return (
      <div className="glass-dark border border-gray-700/50 rounded-lg p-6 my-2">
        <div className="text-text-tertiary text-sm">Invalid messages data</div>
      </div>
    );
  }

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
    if (sender === 'user') return 'bg-primary-500 text-white';
    if (sender === 'system') return 'bg-bg-sub text-text-tertiary text-center';
    return 'bg-bg-sub text-text-primary';
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
    <div className="glass-dark border border-gray-700/50 rounded-lg my-2 overflow-hidden flex flex-col w-fit min-w-[300px] max-w-full">
      {/* Header */}
      {title && (
        <div className="px-6 py-4 border-b border-border-main bg-bg-sub/30">
          <h3 className="text-text-primary font-semibold">{title}</h3>
        </div>
      )}

      {/* Messages Area */}
      <div
        className="overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {messages.length === 0 ? (
          <div className="text-text-tertiary text-sm text-center py-8">
            No messages yet
          </div>
        ) : (
          messages.map((message, index) => (
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
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center">
                        {message.sender === 'bot' ? (
                          <Bot className="w-4 h-4 text-accent-cyan" />
                        ) : (
                          <User className="w-4 h-4 text-text-tertiary" />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Content */}
                <div className="flex flex-col gap-1">
                  {message.name && message.sender !== 'system' && (
                    <div className="text-text-tertiary text-xs px-1">
                      {message.name}
                    </div>
                  )}
                  
                  <div
                    className={`
                      ${getMessageBg(message.sender)}
                      px-4 py-2 rounded-lg
                      ${message.sender === 'system' ? 'text-xs italic' : ''}
                    `}
                  >
                    {message.text}
                  </div>

                  {message.timestamp && message.sender !== 'system' && (
                    <div className="text-text-tertiary text-xs px-1">
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
        <div className="px-4 py-3 border-t border-border-main bg-bg-sub/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={inputPlaceholder}
              className="
                flex-1 px-4 py-2 rounded-lg
                bg-bg-main border border-border-main
                text-text-primary placeholder-text-tertiary
                focus:outline-none focus:ring-2 focus:ring-primary-500
              "
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="
                px-4 py-2 rounded-lg
                bg-primary-500 hover:bg-primary-600
                text-white font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
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
