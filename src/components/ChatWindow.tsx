import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../contexts/AIContext';
import { XIcon, SendIcon, SparklesIcon, MinimizeIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { OpenAIService } from '../services/openai/openaiService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

const TypingMessage: React.FC<{ content: string; onComplete: () => void }> = ({ content, onComplete }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = content.split(' ');

  useEffect(() => {
    if (currentIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(prev => prev + (currentIndex > 0 ? ' ' : '') + words[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Slightly longer delay for word-by-word
      return () => clearTimeout(timeout);
    } else {
      onComplete();
    }
  }, [currentIndex, words, onComplete]);

  return <div className="whitespace-pre-wrap">{displayedContent}</div>;
};

export default function ChatWindow({ isOpen, onClose, onMinimize }: ChatWindowProps) {
  const { aiEnabled } = useAI();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI assistant. How can I help you with your job search and career development today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      chatContainerRef.current.scrollTo({
        top: maxScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!aiEnabled) {
      toast.error('Please enable AI Assistant first');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const openAIService = OpenAIService.getInstance();
      const response = await openAIService.generateChatCompletion(
        input,
        "You are a helpful AI career assistant. Provide brief, direct responses focused on job search and career guidance. Keep responses under 3 sentences when possible. Be specific and actionable. If the user's message is nonsensical or unrelated to career guidance, politely ask them to rephrase their question."
      );

      if (response.error || !response.content || response.content.trim() === '') {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "I'm not sure I understand your question. Could you please rephrase it, focusing on your career goals or job search needs?",
          timestamp: new Date(),
          isTyping: true,
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: response.content,
          timestamp: new Date(),
          isTyping: true,
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble understanding that. Could you please rephrase your question about career guidance or job search?",
        timestamp: new Date(),
        isTyping: true,
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTypingComplete = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-label="AI Career Assistant Chat"
      className="fixed bottom-20 right-6 w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh]"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h3 className="font-medium" id="chat-title">AI Career Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Minimize chat"
          >
            <MinimizeIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <XIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[500px] scroll-smooth"
        role="log"
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            role="article"
            aria-label={`${message.type === 'user' ? 'Your message' : 'AI response'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                message.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.type === 'ai' && message.isTyping ? (
                <TypingMessage 
                  content={message.content} 
                  onComplete={() => handleTypingComplete(message.id)} 
                />
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            disabled={!aiEnabled || isTyping}
            aria-label="Message input"
            role="textbox"
          />
          <button
            type="submit"
            disabled={!aiEnabled || isTyping || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <SendIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}