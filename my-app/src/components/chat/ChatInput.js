'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Send, Mic } from 'lucide-react';

export function ChatInput({ value, onChange, onSend, onMicClick, disabled, placeholder, showMic = false }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, []);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-slate-100 px-5 py-4">
      <div className="flex items-end gap-3">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
          />
          {/* Mic button inside input */}
          {showMic && (
            <button
              type="button"
              onClick={onMicClick}
              className="absolute right-3 bottom-3 rounded-full p-1.5 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
              aria-label="Voice input"
              id="chat-mic-btn"
            >
              <Mic className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200/40 transition hover:shadow-lg hover:shadow-emerald-300/50 disabled:opacity-40 disabled:shadow-none"
          id="chat-send-btn"
          aria-label="Send message"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
      <p className="mt-2 text-center text-[10px] text-slate-400">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
