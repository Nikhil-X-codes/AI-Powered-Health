'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AIMessage } from '@/components/chat/AIMessage';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { UserMessage } from '@/components/chat/UserMessage';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { useToast } from '@/components/ui/Toast';
import {
  ArrowLeft, Heart, Trash2, Plus, MessagesSquare, Volume2,
} from 'lucide-react';

const QUICK_PROMPTS = [
  'Explain my hemoglobin levels',
  'What does this medicine do?',
  'Summarize my latest report',
  'Are my glucose levels normal?',
  'What are the side effects?',
];

function formatDateSeparator(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fetchWithAuth = useAuthenticatedFetch();
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadHistory = async () => {
      try {
        const data = await fetchWithAuth('/api/v1/chat/history');
        const history = (data.messages || []).flatMap((entry) => [
          { id: `${entry.id}-user`, role: 'user', content: entry.userMessage, createdAt: entry.createdAt, sources: [] },
          { id: `${entry.id}-ai`, role: 'assistant', content: entry.aiResponse, createdAt: entry.createdAt, sources: [] },
        ]);
        if (!cancelled) { setMessages(history); }
      } catch {
        if (!cancelled) toast.error('Failed to load chat history');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void loadHistory();
    return () => { cancelled = true; };
  }, [fetchWithAuth, toast]);

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || isSending) return;

    const userMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: messageText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const data = await fetchWithAuth('/api/v1/chat', {
        method: 'POST',
        body: JSON.stringify({ message: messageText }),
      });
      const assistantMessage = {
        id: `local-${Date.now()}-ai`,
        role: 'assistant',
        content: data.response || data.answer,
        createdAt: new Date().toISOString(),
        sources: data.sources || [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      toast.error(err.message || 'AI is temporarily unavailable. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  // Group messages by date
  const messagesWithSeparators = useMemo(() => {
    const result = [];
    let lastDate = null;
    for (const msg of messages) {
      const dateLabel = formatDateSeparator(msg.createdAt);
      if (dateLabel && dateLabel !== lastDate) {
        result.push({ type: 'separator', label: dateLabel, id: `sep-${dateLabel}-${msg.id}` });
        lastDate = dateLabel;
      }
      result.push({ type: 'message', ...msg });
    }
    return result;
  }, [messages]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f4f0ea] via-white to-[#eef6ff]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Heart className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-900">AI Health Assistant</h1>
                  <p className="text-[10px] text-emerald-600 font-medium">RAG-powered • Grounded in your data</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/voice')}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Switch to voice assistant"
              >
                <Volume2 className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                aria-label="Start a new chat conversation"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                New Chat
              </button>
            </div>
          </div>
        </header>

        {/* Chat body */}
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6">
          <ChatContainer
            isLoading={isLoading}
            isEmpty={messages.length === 0}
            emptyMessage="Ask me anything about your health reports or prescriptions"
            quickPrompts={QUICK_PROMPTS}
            onQuickPrompt={(prompt) => handleSend(prompt)}
          >
            {messagesWithSeparators.map((item) => {
              if (item.type === 'separator') {
                return (
                  <div key={item.id} className="flex items-center gap-3 py-2" role="separator">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{item.label}</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                );
              }
              return item.role === 'user' ? (
                <UserMessage key={item.id} content={item.content} createdAt={item.createdAt} />
              ) : (
                <AIMessage key={item.id} content={item.content} createdAt={item.createdAt} sources={item.sources} />
              );
            })}
            {isSending && <TypingIndicator />}
          </ChatContainer>

          {/* Input */}
          <div className="rounded-2xl border border-white/70 bg-white/80 shadow-[0_-10px_40px_rgba(15,23,42,0.06)]">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={() => handleSend()}
              onMicClick={() => router.push('/voice')}
              disabled={isSending}
              placeholder="Ask about a report, prescription, or health topic..."
              showMic
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
