import { Suspense } from 'react';
import VoiceAssistantClient from './VoiceAssistantClient';

export default function VoicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#f1f4ff] via-white to-[#eef6ff] text-slate-900">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
              Loading voice assistant...
            </div>
          </div>
        </div>
      }
    >
      <VoiceAssistantClient />
    </Suspense>
  );
}
