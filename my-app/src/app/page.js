import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  FileText,
  Mic,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  Volume2,
} from 'lucide-react';

const featureCards = [
  {
    icon: FileText,
    title: 'Report Analyzer',
    description: 'Upload PDFs or images, extract medical values, and get a structured summary.',
  },
  {
    icon: Stethoscope,
    title: 'Prescription Explainer',
    description: 'Detect medicines, dosages, and usage instructions with a simple explanation.',
  },
  {
    icon: BrainCircuit,
    title: 'RAG Chat Assistant',
    description: 'Ask questions about your reports and prescriptions with source-backed answers.',
  },
  {
    icon: Activity,
    title: 'Health Dashboard',
    description: 'Track trends, highs and lows, and your latest report history in one place.',
  },
  {
    icon: Volume2,
    title: 'Voice Assistant',
    description: 'Use speech-to-text, AI responses, and audio playback for hands-free access.',
  },
  {
    icon: ShieldCheck,
    title: 'Protected Access',
    description: 'JWT-based login, protected routes, and secure user-specific data flow.',
  },
];

const workflow = [
  'Upload a report or prescription',
  'OCR extracts text and values',
  'AI explains the findings',
  'Embedded context powers chat',
  'Dashboard updates automatically',
];

const ctaButtons = [
  { href: '/auth/signup', label: 'Create account', primary: true },
  { href: '/auth/login', label: 'Sign in', primary: false },
  { href: '/dashboard', label: 'Open dashboard', primary: false },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dceafe,_transparent_32%),radial-gradient(circle_at_top_right,_#fbe3d5,_transparent_28%),linear-gradient(135deg,_#f6f1e8_0%,_#ffffff_40%,_#eef5ff_100%)] text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-8 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-4 rounded-full border border-white/70 bg-white/70 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Health AI Platform</p>
            <h1 className="text-lg font-semibold text-slate-900">Medical reports, prescriptions, chat, and voice in one workflow.</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {ctaButtons.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                  cta.primary
                    ? 'bg-slate-900 text-white hover:bg-slate-700'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cta.label}
                {cta.primary ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
              </Link>
            ))}
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 shadow-sm">
              <Sparkles className="h-4 w-4 text-sky-600" />
              AI health companion
            </div>
            <div className="max-w-3xl space-y-5">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Turn lab reports and prescriptions into answers you can actually use.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                This app combines OCR, report analysis, prescription explanation, RAG chat, and a dashboard so users can move from raw documents to clear next steps.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Open AI chat
              </Link>
              <Link
                href="/voice"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Voice assistant
                <Mic className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Upload</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">PDFs and images</p>
                <p className="mt-2 text-sm text-slate-600">Reports and prescriptions both work.</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Explain</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Medical values</p>
                <p className="mt-2 text-sm text-slate-600">Clear summaries and medicine guidance.</p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Search</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">RAG answers</p>
                <p className="mt-2 text-sm text-slate-600">Chat uses your own medical context.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-6 h-28 w-28 rounded-full bg-sky-300/30 blur-3xl" />
            <div className="absolute -right-8 bottom-8 h-32 w-32 rounded-full bg-orange-300/30 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-[0_35px_80px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Built for clarity</p>
                  <h3 className="mt-2 text-2xl font-semibold">From document to dashboard</h3>
                </div>
                <div className="rounded-2xl bg-white/10 p-3 text-sky-300">
                  <Upload className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                {workflow.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                  <span>Security</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  JWT auth, protected routes, and per-user data keep the experience scoped to the signed-in user.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Core features</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Everything the MVP needs</h3>
            </div>
            <p className="max-w-xl text-sm text-slate-600">
              Authentication, medical analysis, dashboarding, RAG chat, and voice are all designed to work as one flow.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
                >
                  <div className="inline-flex rounded-2xl bg-slate-900 p-3 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-slate-950">{feature.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Product flow</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">Designed for the complete medical loop</h3>
            <div className="mt-6 grid gap-3">
              {[
                'Login securely with JWT and protected routes.',
                'Upload a report or prescription from the app.',
                'Run OCR, analysis, and explanation automatically.',
                'Store embeddings so chat can reference the source.',
                'Review trends and alerts in the dashboard.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-slate-900 p-8 text-white shadow-[0_20px_50px_rgba(15,23,42,0.2)]">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">MVP scope</p>
            <h3 className="mt-2 text-2xl font-semibold">Start small, keep the UX polished</h3>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              The home page now funnels users into the core MVP: authentication, report upload, OCR extraction, report simplification, dashboard, and the basic RAG chatbot.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Start now
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
