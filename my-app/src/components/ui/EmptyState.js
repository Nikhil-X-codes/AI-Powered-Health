import { FileText, Stethoscope, Syringe, MessagesSquare, Mic } from 'lucide-react';

const ILLUSTRATIONS = {
  report: { icon: FileText, gradient: 'from-blue-50 to-sky-50', iconColor: 'text-blue-400' },
  prescription: { icon: Syringe, gradient: 'from-violet-50 to-purple-50', iconColor: 'text-violet-400' },
  chat: { icon: MessagesSquare, gradient: 'from-emerald-50 to-teal-50', iconColor: 'text-emerald-400' },
  voice: { icon: Mic, gradient: 'from-amber-50 to-orange-50', iconColor: 'text-amber-400' },
  health: { icon: Stethoscope, gradient: 'from-emerald-50 to-teal-50', iconColor: 'text-emerald-400' },
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  illustration = 'health',
  secondaryActionLabel,
  onSecondaryAction,
}) {
  const illus = ILLUSTRATIONS[illustration] || ILLUSTRATIONS.health;
  const Icon = illus.icon;

  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-14 text-center">
      <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${illus.gradient}`}>
        <Icon className={`h-10 w-10 ${illus.iconColor}`} />
      </div>
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
      )}
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
