import { SourceBadge } from './SourceBadge';
import { Shield, Info } from 'lucide-react';

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function AIMessage({ content, createdAt, sources = [], contextMode = 'personal' }) {
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="flex gap-3 max-w-[80%]">
        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mt-1">
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        </div>

        {/* Message bubble */}
        <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-5 py-3.5 text-sm text-slate-800 shadow-sm">
          {contextMode === 'general' && (
            <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>General medical info only. No personal document context was found for this answer.</span>
            </div>
          )}
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>

          {/* Source badges */}
          {sources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {sources.map((source) => (
                <SourceBadge
                  key={`${source.type}:${source.id}`}
                  label={source.label}
                  type={source.type}
                />
              ))}
            </div>
          )}

          {/* Medical disclaimer */}
          <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3">
            <Shield className="h-3 w-3 shrink-0 text-slate-300" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              For informational purposes only — consult a healthcare professional
            </p>
          </div>

          <p className="mt-2 text-[11px] text-slate-400">{formatTimestamp(createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
