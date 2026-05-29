import { FileText, Syringe } from 'lucide-react';

export function SourceBadge({ label, type }) {
  if (!label) return null;

  const isReport = type === 'report';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition hover:shadow-sm ${
      isReport
        ? 'border-blue-200 bg-blue-50 text-blue-700'
        : 'border-violet-200 bg-violet-50 text-violet-700'
    }`}>
      {isReport ? <FileText className="h-3 w-3" /> : <Syringe className="h-3 w-3" />}
      {label}
    </span>
  );
}
