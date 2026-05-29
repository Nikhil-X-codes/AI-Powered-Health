'use client';

import {
  Activity,
  ArrowRight,
  BarChart3,
  FileText,
  Loader2,
  MessagesSquare,
  Pill,
  Plus,
  ScanSearch,
  Syringe,
  Upload,
  Volume2,
  AlertTriangle,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';

const chartColors = ['#059669', '#f97316', '#0ea5e9', '#8b5cf6'];
const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b', '#f97316'];

function formatDateShort(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateLong(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function skKey(prefix, index) {
  return `${prefix}-${index}`;
}

/* ── Skeleton ──────────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={skKey('stat', i)} className="h-28 animate-pulse rounded-2xl bg-white/80 border border-white/70 p-5">
            <div className="h-3 w-20 rounded-full bg-slate-200" />
            <div className="mt-4 h-7 w-14 rounded-full bg-slate-200" />
            <div className="mt-3 h-2.5 w-28 rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="h-[400px] animate-pulse rounded-3xl bg-white/80 border border-white/70 p-6">
          <div className="h-4 w-40 rounded-full bg-slate-200" />
          <div className="mt-6 h-[320px] rounded-2xl bg-slate-100" />
        </div>
        <div className="h-[400px] animate-pulse rounded-3xl bg-white/80 border border-white/70 p-6">
          <div className="h-4 w-28 rounded-full bg-slate-200" />
          <div className="mt-6 flex items-center justify-center h-[320px]">
            <div className="h-48 w-48 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section Card ──────────────────────────────────────────── */
function SectionCard({ title, eyebrow, children, actions }) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        {actions}
      </div>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

/* ── Status Pill ───────────────────────────────────────────── */
function StatusPill({ tone = 'neutral', children }) {
  const toneClasses = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    alert: 'bg-rose-50 text-rose-700',
    info: 'bg-sky-50 text-sky-700',
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>{children}</span>;
}

/* ── Empty State ───────────────────────────────────────────── */
function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
      {/* Illustration */}
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50">
        <FileText className="h-10 w-10 text-emerald-400" />
      </div>
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-gradient mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ── Floating Action Button ────────────────────────────────── */
function QuickActionsFAB({ onUploadReport, onUploadPrescription, onAskAI }) {
  const [open, setOpen] = useState(false);
  const actions = [
    { label: 'Upload Report', icon: Upload, onClick: onUploadReport, color: 'bg-emerald-500' },
    { label: 'Upload Prescription', icon: Syringe, onClick: onUploadPrescription, color: 'bg-teal-500' },
    { label: 'Ask AI', icon: MessagesSquare, onClick: onAskAI, color: 'bg-violet-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col items-end gap-2 animate-fade-in-up">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => { action.onClick(); setOpen(false); }}
                className="flex items-center gap-2.5 rounded-full bg-white pl-4 pr-3 py-2.5 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/60 border border-slate-200/80 transition hover:shadow-xl hover:-translate-y-0.5"
              >
                {action.label}
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${action.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </button>
            );
          })}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          open
            ? 'bg-slate-800 rotate-45 shadow-slate-300'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300'
        }`}
      >
        {open ? <X className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD PAGE
   ══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const fetchWithAuth = useAuthenticatedFetch();
  const router = useRouter();
  const uploadSectionRef = useRef(null);
  const reportInputRef = useRef(null);
  const prescriptionInputRef = useRef(null);

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [reportName, setReportName] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [isUploadingReport, setIsUploadingReport] = useState(false);
  const [isUploadingPrescription, setIsUploadingPrescription] = useState(false);
  const [analyzingReportId, setAnalyzingReportId] = useState(null);
  const [explainingPrescriptionId, setExplainingPrescriptionId] = useState(null);

  const scrollToUpload = useCallback(() => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth('/api/v1/dashboard');
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Dashboard temporarily unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithAuth('/api/v1/dashboard');
        if (!cancelled) { setDashboardData(data); setError(null); }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Dashboard temporarily unavailable.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void loadDashboard();
    return () => { cancelled = true; };
  }, [fetchWithAuth, isAuthenticated]);

  const uploadReport = async () => {
    if (!reportFile) { setError('Choose a report file before uploading.'); return; }
    try {
      setIsUploadingReport(true);
      setMessage('Uploading report...');
      const formData = new FormData();
      formData.append('report', reportFile);
      if (reportName.trim()) formData.append('report_name', reportName.trim());
      await fetchWithAuth('/api/v1/reports/upload', { method: 'POST', body: formData });
      setReportFile(null);
      setReportName('');
      if (reportInputRef.current) reportInputRef.current.value = '';
      setMessage('Report uploaded successfully. Analyze it to extract metrics.');
      await fetchDashboard();
    } catch (err) {
      setError(err.message || 'Failed to upload report.');
    } finally {
      setIsUploadingReport(false);
    }
  };

  const uploadPrescription = async () => {
    if (!prescriptionFile) { setError('Choose a prescription file before uploading.'); return; }
    try {
      setIsUploadingPrescription(true);
      setMessage('Uploading prescription...');
      const formData = new FormData();
      formData.append('prescription', prescriptionFile);
      await fetchWithAuth('/api/v1/prescriptions/upload', { method: 'POST', body: formData });
      setPrescriptionFile(null);
      if (prescriptionInputRef.current) prescriptionInputRef.current.value = '';
      setMessage('Prescription uploaded. Explain it to extract medicines.');
      await fetchDashboard();
    } catch (err) {
      setError(err.message || 'Failed to upload prescription.');
    } finally {
      setIsUploadingPrescription(false);
    }
  };

  const handleAnalyzeReport = async (reportId) => {
    try {
      setAnalyzingReportId(reportId);
      setMessage('Analyzing report...');
      await fetchWithAuth(`/api/v1/reports/analyze/${reportId}`, { method: 'POST' });
      setMessage('Report analyzed successfully.');
      await fetchDashboard();
    } catch (err) {
      setError(err.message || 'Failed to analyze report.');
    } finally {
      setAnalyzingReportId(null);
    }
  };

  const handleExplainPrescription = async (prescriptionId) => {
    try {
      setExplainingPrescriptionId(prescriptionId);
      setMessage('Explaining prescription...');
      await fetchWithAuth(`/api/v1/prescriptions/explain/${prescriptionId}`, { method: 'POST' });
      setMessage('Prescription explained successfully.');
      await fetchDashboard();
    } catch (err) {
      setError(err.message || 'Failed to explain prescription.');
    } finally {
      setExplainingPrescriptionId(null);
    }
  };

  /* ── Derived data ──────────────────────────────────────── */
  const stats = useMemo(() => {
    const entries = dashboardData?.stats;
    if (!entries) return [];
    return [
      { label: 'Reports', value: entries.reportsCount, icon: FileText, gradient: 'from-blue-500 to-blue-600' },
      { label: 'Prescriptions', value: entries.prescriptionsCount, icon: Syringe, gradient: 'from-violet-500 to-violet-600' },
      { label: 'Health Metrics', value: entries.healthMetricsCount, icon: Activity, gradient: 'from-emerald-500 to-emerald-600' },
      { label: 'Analyzed', value: (dashboardData?.recentReports || []).filter(r => r.analysisStatus === 'Analyzed').length, icon: ScanSearch, gradient: 'from-amber-500 to-orange-500' },
    ];
  }, [dashboardData]);

  const trendLabels = dashboardData?.trends?.chartMetricLabels || [];
  const trendData = dashboardData?.trends?.chartData || [];
  const groupedMetricCount = dashboardData?.trends?.totalMetricGroups || 0;
  const recentReports = dashboardData?.recentReports || [];
  const recentPrescriptions = dashboardData?.recentPrescriptions || [];
  const healthAlerts = dashboardData?.healthAlerts || [];
  const hasEmptyDashboard = !isLoading && !error && stats.length === 0 && recentReports.length === 0 && recentPrescriptions.length === 0;

  /* Status distribution for pie chart */
  const statusDistribution = useMemo(() => {
    const allMetrics = dashboardData?.trends?.groupedMetrics || [];
    const counts = { Normal: 0, High: 0, Low: 0, Borderline: 0 };
    for (const group of allMetrics) {
      for (const point of group.points || []) {
        const status = point.status || 'Normal';
        if (counts[status] !== undefined) counts[status]++;
        else counts.Normal++;
      }
    }
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [dashboardData]);

  const alertToneMap = {
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    alert: 'border-rose-200 bg-rose-50 text-rose-800',
    info: 'border-sky-200 bg-sky-50 text-sky-800',
  };

  return (
    <div className="relative min-h-full text-slate-900">
      {/* Background orbs */}
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-[#d9e7ff] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-32 h-96 w-96 rounded-full bg-[#ffd9c7] opacity-30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* ── Page header ───────────────────────────────── */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Health Command Center</p>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, <span className="text-emerald-600">{user?.name || 'there'}</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* ── Alerts banner ─────────────────────────────── */}
        {healthAlerts.length > 0 && !isLoading && (
          <div className="space-y-3 animate-fade-in-up">
            {healthAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 ${alertToneMap[alert.tone] || alertToneMap.info}`}
              >
                <div className="flex items-center gap-3">
                  <div className="animate-pulse-dot">
                    <div className={`h-2.5 w-2.5 rounded-full ${alert.tone === 'alert' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{alert.title}</p>
                    <p className="text-xs opacity-80">{alert.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/reports`)}
                  className="shrink-0 rounded-full border border-current/20 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/50"
                >
                  View Report
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Feedback messages */}
        {message && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-700 animate-fade-in-up">
            <TrendingUp className="h-4 w-4 shrink-0" />
            {message}
            <button onClick={() => setMessage(null)} className="ml-auto text-emerald-500 hover:text-emerald-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 animate-fade-in-up">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {isLoading ? <DashboardSkeleton /> : null}

        {/* ── Stats cards ───────────────────────────────── */}
        {!isLoading && !error && stats.length > 0 && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              );
            })}
          </section>
        )}

        {hasEmptyDashboard && (
          <EmptyState
            title="Welcome to MedExplain AI!"
            description="Upload your first medical report or prescription to start tracking health metrics, trends, and get AI-powered explanations."
            actionLabel="Upload now"
            onAction={scrollToUpload}
          />
        )}

        {/* ── Charts row ────────────────────────────────── */}
        {!isLoading && !error && (
          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Trend chart */}
            <SectionCard
              eyebrow="Health trends"
              title={`Metric series${groupedMetricCount ? ` (${groupedMetricCount})` : ''}`}
              actions={
                trendLabels.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {trendLabels.map((label, index) => (
                      <StatusPill key={label.key} tone="neutral">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                          {label.label}
                        </span>
                      </StatusPill>
                    ))}
                  </div>
                ) : null
              }
            >
              {trendData.length > 0 && trendLabels.length > 0 ? (
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        {trendLabels.map((label, index) => (
                          <linearGradient key={`grad-${label.key}`} id={`grad-${label.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tickFormatter={formatDateShort} stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip labelFormatter={(label) => `Date: ${label}`} />
                      {trendLabels.map((label, index) => (
                        <Area
                          key={label.key}
                          type="monotone"
                          dataKey={label.key}
                          stroke={chartColors[index % chartColors.length]}
                          strokeWidth={2}
                          fill={`url(#grad-${label.key})`}
                          dot={false}
                          connectNulls
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState
                  title="No chart data yet"
                  description="Analyze a report to see metric trends over time."
                  actionLabel="Upload Report"
                  onAction={scrollToUpload}
                />
              )}
            </SectionCard>

            {/* Status distribution pie */}
            <SectionCard eyebrow="Distribution" title="Metric Status">
              {statusDistribution.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 flex flex-wrap justify-center gap-3">
                    {statusDistribution.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                        {entry.name} ({entry.value})
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState title="No metrics yet" description="Analyze a report to see status distribution." />
              )}
            </SectionCard>
          </section>
        )}

        {/* ── Recent Reports (horizontal scroll) ────────── */}
        {!isLoading && !error && (
          <SectionCard
            eyebrow="Recent reports"
            title="Latest uploads"
            actions={
              <button
                onClick={() => router.push('/dashboard/reports')}
                className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
              >
                View all
              </button>
            }
          >
            {recentReports.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory">
                {recentReports.map((report) => {
                  const isAnalyzed = report.analysisStatus === 'Analyzed';
                  return (
                    <div
                      key={report.id}
                      className="min-w-[280px] snap-start rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-1 cursor-pointer"
                      onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                          <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <StatusPill tone={isAnalyzed ? 'success' : 'warning'}>
                          {report.analysisStatus}
                        </StatusPill>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-900 truncate">
                        {report.reportName || 'Untitled report'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDateLong(report.createdAt)} • {report.metricCount} metrics
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          isAnalyzed ? router.push('/chat') : handleAnalyzeReport(report.id);
                        }}
                        disabled={analyzingReportId === report.id}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                      >
                        {analyzingReportId === report.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {isAnalyzed ? 'Ask AI' : 'Analyze'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No reports yet"
                description="Upload a report to get started."
                actionLabel="Upload report"
                onAction={scrollToUpload}
              />
            )}
          </SectionCard>
        )}

        {/* ── Recent Prescriptions (horizontal scroll) ──── */}
        {!isLoading && !error && (
          <SectionCard
            eyebrow="Recent prescriptions"
            title="Latest uploads"
            actions={
              <button
                onClick={() => router.push('/dashboard/prescriptions')}
                className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
              >
                View all
              </button>
            }
          >
            {recentPrescriptions.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory">
                {recentPrescriptions.map((prescription) => {
                  const isExplained = prescription.explanationStatus === 'Explained';
                  return (
                    <div
                      key={prescription.id}
                      className="min-w-[280px] snap-start rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-1 cursor-pointer"
                      onClick={() => router.push(`/dashboard/prescriptions/${prescription.id}`)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                          <Syringe className="h-5 w-5 text-violet-500" />
                        </div>
                        <StatusPill tone={isExplained ? 'success' : 'warning'}>
                          {prescription.explanationStatus}
                        </StatusPill>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-900">Prescription</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDateLong(prescription.createdAt)} • {prescription.medicineCount} medicines
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          isExplained ? router.push('/chat') : handleExplainPrescription(prescription.id);
                        }}
                        disabled={explainingPrescriptionId === prescription.id}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                      >
                        {explainingPrescriptionId === prescription.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {isExplained ? 'Ask AI' : 'Explain'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No prescriptions yet"
                description="Upload a prescription to extract medicines."
                actionLabel="Upload prescription"
                onAction={scrollToUpload}
              />
            )}
          </SectionCard>
        )}

        {/* ── Upload Section ────────────────────────────── */}
        <section ref={uploadSectionRef} className="grid gap-6 lg:grid-cols-2">
          <SectionCard eyebrow="Upload" title="Add a report">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Report name</label>
                <input
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Blood Test May 2026"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Report file</label>
                <input
                  ref={reportInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                  className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-emerald-700"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={uploadReport}
                  disabled={isUploadingReport}
                  className="btn-gradient inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {isUploadingReport ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Upload report
                </button>
              </div>
              {reportFile && <p className="text-xs text-slate-500">Selected: {reportFile.name}</p>}
            </div>
          </SectionCard>

          <SectionCard eyebrow="Upload" title="Add a prescription">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Prescription file</label>
                <input
                  ref={prescriptionInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                  className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-violet-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-violet-700"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={uploadPrescription}
                  disabled={isUploadingPrescription}
                  className="btn-gradient inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {isUploadingPrescription ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Upload prescription
                </button>
              </div>
              {prescriptionFile && <p className="text-xs text-slate-500">Selected: {prescriptionFile.name}</p>}
            </div>
          </SectionCard>
        </section>
      </div>

      {/* FAB */}
      <QuickActionsFAB
        onUploadReport={scrollToUpload}
        onUploadPrescription={scrollToUpload}
        onAskAI={() => router.push('/chat')}
      />
    </div>
  );
}
