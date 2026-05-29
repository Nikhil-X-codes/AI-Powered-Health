'use client';

import Link from 'next/link';
import { Shield, Lock, BadgeCheck, Heart, Activity, FileText, Stethoscope } from 'lucide-react';

const TRUST_BADGES = [
  { icon: Shield, label: 'HIPAA Compliant' },
  { icon: Lock, label: '256-bit Encrypted' },
  { icon: BadgeCheck, label: 'SOC 2 Certified' },
];

const FEATURES = [
  { icon: FileText, text: 'AI-powered medical report analysis' },
  { icon: Activity, text: 'Track health trends over time' },
  { icon: Heart, text: 'Understand prescriptions instantly' },
  { icon: Stethoscope, text: 'Chat with an AI health assistant' },
];

export default function AuthLayout({ children, heading, subheading }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left Panel — Branding ────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[48%] flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-10 text-white">
        {/* Animated background orbs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute right-[-60px] top-[40%] h-72 w-72 rounded-full bg-teal-400/15 blur-3xl animate-float-delayed" />
        <div className="pointer-events-none absolute bottom-[-40px] left-[30%] h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl animate-float" />

        {/* Decorative grid pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Top — Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm transition group-hover:bg-white/25">
              <Heart className="h-6 w-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">MedExplain</span>
              <span className="ml-1 text-xl font-light text-emerald-300">AI</span>
            </div>
          </Link>
        </div>

        {/* Center — Hero content */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            <Activity className="h-3.5 w-3.5" />
            Trusted by 10,000+ users
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Your health data,{' '}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              simplified.
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-emerald-100/80">
            Upload medical reports and prescriptions. Our AI explains complex terminology,
            tracks health trends, and answers your questions — all in plain language.
          </p>

          <div className="mt-8 space-y-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.text} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-4.5 w-4.5 text-emerald-300" />
                  </div>
                  <span className="text-sm text-emerald-50/90">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom — Trust badges */}
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-5">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-emerald-200/80 animate-pulse-slow"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {badge.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ───────────────────────────────── */}
      <div className="relative flex flex-1 flex-col bg-gradient-to-b from-slate-50 to-white">
        {/* Mobile-only top branding */}
        <div className="flex items-center gap-3 px-6 pt-6 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900">MedExplain</span>
            <span className="ml-1 text-lg font-light text-emerald-600">AI</span>
          </div>
        </div>

        {/* Form container */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-12">
          <div className="w-full max-w-md animate-fade-in-up">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {heading}
              </h2>
              {subheading && (
                <p className="mt-2 text-sm text-slate-500">{subheading}</p>
              )}
            </div>

            {/* Form slot */}
            {children}
          </div>
        </div>

        {/* Bottom — Privacy notice */}
        <div className="border-t border-slate-100 px-6 py-4">
          <div className="mx-auto flex max-w-md items-start gap-3">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p className="text-xs leading-relaxed text-slate-400">
              Your data is protected under HIPAA guidelines. We use end-to-end encryption
              and never share your medical information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
