'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PRESETS = [
  'What are your core skills?',
  'Tell me about neuro-flow',
  'Are you available for freelance work?',
  'How do you optimize web performance?'
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Krish's AI Assistant. Ask me anything about his projects, technical expertise, or experience!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error('API Request Failed');

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.content }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I ran into a connection issue. Please verify the API key is configured or try again later.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent-purple to-accent-blue flex items-center justify-center text-white shadow-lg cursor-pointer hover:shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent-purple to-accent-blue animate-ping opacity-25 group-hover:opacity-40 transition-opacity" />
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-20 right-0 w-[90vw] sm:w-[400px] h-[550px] rounded-2xl glass-panel shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-purple animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">Krish AI Assistant</h4>
                  <span className="text-[10px] text-zinc-500">Trained on Portfolio</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-br-none shadow-md'
                        : 'bg-white/5 border border-white/5 text-zinc-300 rounded-bl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              
              {/* Typing loader */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 text-zinc-300 rounded-xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Presets suggestions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-white/5 bg-black/20">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleSendMessage(preset)}
                    className="text-[11px] text-zinc-400 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition-all px-2.5 py-1 rounded-full cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-4 border-t border-white/5 bg-black/40 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about skills, timeline, projects..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-purple focus:bg-white/10 transition-all placeholder:text-zinc-600 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-gradient-to-r hover:from-accent-purple hover:to-accent-blue hover:border-transparent transition-all disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/5 disabled:hover:text-zinc-500 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
