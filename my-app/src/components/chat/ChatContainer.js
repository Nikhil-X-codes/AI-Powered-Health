'use client';

import { useEffect, useRef } from 'react';
import { MessagesSquare, Stethoscope } from 'lucide-react';

export function ChatContainer({ children, isLoading, isEmpty, emptyMessage, quickPrompts, onQuickPrompt }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when children change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <section className="flex min-h-[60vh] max-h-[65vh] flex-col rounded-3xl border border-white/70 bg-white/80 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
      <div
        ref={scrollRef}
        className="flex-1 space-y-5 overflow-y-auto px-6 py-6 scroll-smooth"
      >
        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
            </div>
            <p className="text-sm text-slate-400">Loading conversation...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && isEmpty && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50">
              <Stethoscope className="h-10 w-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {emptyMessage || 'Ask me anything about your health'}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              I can explain your medical reports, prescriptions, and answer health-related questions grounded in your data.
            </p>

            {/* Quick prompts */}
            {quickPrompts && quickPrompts.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => onQuickPrompt?.(prompt)}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {!isLoading && !isEmpty && children}
      </div>
    </section>
  );
}
