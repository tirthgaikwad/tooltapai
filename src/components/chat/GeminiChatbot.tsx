import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, X, Send, Bot, User, Trash2, Zap, DollarSign, Compass, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [model, setModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [role, setRole] = useState<'advisor' | 'pricing' | 'speed'>('advisor');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '👋 Hi! I am your ToolTap AI Advisor powered by Gemini. Ask me anything about 600+ AI tools, pricing comparisons, or finding the best free plan for your workflow.',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          model,
          role,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || 'Here is what I found for your AI workflow.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      toast.error('Chat error: ' + err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue reaching the Gemini engine. Please try again.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation history cleared. How can I help you discover AI tools today?',
        timestamp: 'Just now',
      },
    ]);
  };

  const samplePrompts = [
    'Best AI video tools with generous free tiers?',
    'Compare ChatGPT Canvas vs Cursor Composer',
    'Free tools for summarizing research papers',
    'Top AI stack for engineering students',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium text-sm rounded-full shadow-2xl hover:shadow-emerald-500/20 active:scale-95 transition-all duration-200 border border-emerald-400/30"
          aria-label="Open ToolTap AI Assistant"
        >
          <Sparkles className="w-5 h-5 animate-pulse text-amber-200" />
          <span className="font-semibold tracking-wide">Ask ToolTap AI</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#141418]/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-[#1C1C22]/90 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
                  ToolTap AI Advisor
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                    Gemini
                  </span>
                </h3>
                <p className="text-[11px] text-white/50">Multi-turn AI Assistant & Changelog Analyst</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearHistory}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                title="Clear history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model and Role Controls */}
          <div className="px-3 py-2 bg-[#18181E] border-b border-white/5 flex items-center justify-between gap-2 text-xs shrink-0">
            {/* Role selector */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-white/40 uppercase font-semibold mr-1">Role:</span>
              <button
                onClick={() => setRole('advisor')}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1',
                  role === 'advisor'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-white/60 hover:text-white bg-white/5'
                )}
              >
                <Compass className="w-3 h-3" /> Advisor
              </button>
              <button
                onClick={() => setRole('pricing')}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1',
                  role === 'pricing'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'text-white/60 hover:text-white bg-white/5'
                )}
              >
                <DollarSign className="w-3 h-3" /> Pricing
              </button>
              <button
                onClick={() => setRole('speed')}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1',
                  role === 'speed'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-white/60 hover:text-white bg-white/5'
                )}
              >
                <Zap className="w-3 h-3" /> Fast
              </button>
            </div>

            {/* Model switcher */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setModel(model === 'gemini-3.8-flash' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash')}
                className="text-[10px] text-white/60 hover:text-white bg-white/5 px-2 py-0.5 rounded border border-white/10"
                title="Toggle Gemini Model"
              >
                {model === 'gemini-3.8-flash' ? '⚡ 3.8 Flash' : '🚀 3.1 Flash-Lite'}
              </button>
            </div>
          </div>

          {/* Messages Scroll Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={cn('flex gap-2.5', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-sm shadow-sm',
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white/[0.06] border border-white/10 text-white/90 rounded-bl-xs'
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <div
                    className={cn(
                      'text-[10px] mt-1',
                      m.role === 'user' ? 'text-emerald-100/70 text-right' : 'text-white/40'
                    )}
                  >
                    {m.timestamp}
                  </div>
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/80 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl px-3.5 py-2 text-white/60 text-xs flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Consulting Gemini catalog...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions if few messages */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-[#121216] border-t border-white/5 flex flex-wrap gap-1.5 shrink-0">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="text-[11px] text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded-full transition-colors truncate max-w-[190px]"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-[#18181E] border-t border-white/10 shrink-0">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about AI tools, pricing, or workflows..."
                className="flex-1 bg-transparent border-0 text-sm text-white placeholder-white/40 focus:outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeminiChatbot;
