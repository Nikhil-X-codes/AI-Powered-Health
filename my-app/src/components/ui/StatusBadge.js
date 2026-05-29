const TONE_MAP = {
  /* Health metric statuses */
  normal: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  high: 'border-rose-200 bg-rose-50 text-rose-700',
  low: 'border-amber-200 bg-amber-50 text-amber-700',
  borderline: 'border-orange-200 bg-orange-50 text-orange-700',

  /* General statuses */
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
  neutral: 'border-slate-200 bg-slate-100 text-slate-600',

  /* Report/Prescription statuses */
  analyzed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  explained: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const DOT_COLORS = {
  normal: 'bg-emerald-500',
  high: 'bg-rose-500',
  low: 'bg-amber-500',
  borderline: 'bg-orange-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500',
  info: 'bg-sky-500',
  neutral: 'bg-slate-400',
  analyzed: 'bg-emerald-500',
  pending: 'bg-amber-500',
  explained: 'bg-emerald-500',
};

export function StatusBadge({ status, showDot = false, className = '' }) {
  if (!status) return null;

  const key = status.toLowerCase();
  const classes = TONE_MAP[key] || TONE_MAP.neutral;
  const dotColor = DOT_COLORS[key] || DOT_COLORS.neutral;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${classes} ${className}`}>
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      {status}
    </span>
  );
}
