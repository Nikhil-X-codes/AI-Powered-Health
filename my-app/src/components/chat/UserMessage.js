function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function UserMessage({ content, createdAt }) {
  return (
    <div className="flex justify-end animate-fade-in-up">
      <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-gradient-to-br from-emerald-600 to-teal-600 px-5 py-3.5 text-sm text-white shadow-md shadow-emerald-200/30">
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        <p className="mt-2 text-right text-[11px] text-white/60">{formatTimestamp(createdAt)}</p>
      </div>
    </div>
  );
}
