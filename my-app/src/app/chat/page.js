'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { ArrowLeft, Send } from 'lucide-react';

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('report_id');
  const { user } = useAuth();
  const fetchWithAuth = useAuthenticatedFetch();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const groupedMessages = useMemo(() => messages, [messages]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth('/api/v1/chat/history');
      const history = (data.messages || []).flatMap((entry) => [
        {
          id: `${entry.id}-user`,
          role: 'user',
          content: entry.userMessage,
          createdAt: entry.createdAt,
        },
        {
          id: `${entry.id}-ai`,
          role: 'assistant',
          content: entry.aiResponse,
          createdAt: entry.createdAt,
        },
      ]);
      setMessages(history);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isSending) {
      return;
    }

    const userMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const data = await fetchWithAuth('/api/v1/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage.content,
          report_id: reportId,
        }),
      });

      const assistantMessage = {
        id: `local-${Date.now()}-ai`,
        role: 'assistant',
        content: data.answer,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#f4f0ea] via-white to-[#eef6ff] text-slate-900">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </button>
              <h1 className="mt-4 text-3xl font-semibold">AI Health Assistant</h1>
              <p className="mt-2 text-sm text-slate-600">
                Ask about reports, prescriptions, or general medical questions.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm shadow">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed in</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
          </header>

          <section className="flex min-h-[60vh] flex-col rounded-3xl border border-white/70 bg-white/80 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {isLoading && (
                <p className="text-sm text-slate-500">Loading conversation...</p>
              )}
              {!isLoading && groupedMessages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No messages yet. Ask your first question to start the RAG chat.
                </div>
              )}
              {groupedMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      message.role === 'user'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="mt-2 text-[11px] opacity-60">
                      {formatTimestamp(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 px-6 py-4">
              {error && (
                <p className="mb-3 rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700">
                  {error}
                </p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about a report, prescription, or medical topic..."
                  rows={2}
                  className="flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
                >
                  {isSending ? 'Sending...' : 'Send'}
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
