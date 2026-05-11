'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { type ChatMessage } from '@/types';
import { UI } from '@/lib/constants';
import { getSupabaseClient } from '@/lib/supabase';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: UI.chatbot.welcome,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: userMessage.content },
      });

      if (error) throw error;

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data?.response ?? 'Sorry, I could not process that. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I\'m having trouble connecting right now. Please try again in a moment.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 z-40 w-14 h-14 rounded-full
                   bg-forest-700 shadow-lg flex items-center justify-center
                   hover:bg-forest-600 transition-colors"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-sage-400 rounded-full
                         flex items-center justify-center">
          <span className="text-[8px] font-bold text-white">AI</span>
        </span>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 z-40 w-80 sm:w-96 bg-white rounded-2xl
                       shadow-modal border border-cream-200 flex flex-col overflow-hidden"
            style={{ maxHeight: '70vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-forest-700">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-sage-300" />
                <div>
                  <h3 className="font-body font-semibold text-sm text-white">
                    {UI.chatbot.title}
                  </h3>
                  <p className="text-[10px] text-forest-300">Powered by AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center
                           hover:bg-forest-500 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'assistant'
                        ? 'bg-forest-100'
                        : 'bg-forest-700'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <Bot className="w-4 h-4 text-forest-600" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm font-body leading-relaxed ${
                      msg.role === 'assistant'
                        ? 'bg-cream-50 text-gray-800 rounded-tl-sm border border-cream-200'
                        : 'bg-forest-700 text-white rounded-tr-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-forest-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-forest-600" />
                  </div>
                  <div className="bg-cream-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-cream-200">
                    <Loader2 className="w-4 h-4 text-forest-500 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-cream-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={UI.chatbot.placeholder}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50
                             text-sm font-body focus:outline-none focus:ring-2
                             focus:ring-forest-500/30 focus:border-forest-500 transition-all"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-forest-700 flex items-center justify-center
                             hover:bg-forest-600 disabled:opacity-40 transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
