'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  FileText,
  FlaskConical,
  Stethoscope,
  Syringe,
  Upload,
  Volume2,
  MessagesSquare,
} from 'lucide-react';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatDateFull(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const fetchWithAuth = useAuthenticatedFetch();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth('/api/v1/dashboard');
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    fetchDashboard();
  }, [isAuthenticated, fetchDashboard]);

  const handleAnalyzeReport = async (reportId) => {
    try {
      setActionMessage('Analyzing report...');
      await fetchWithAuth(`/api/v1/reports/analyze/${reportId}`, {
        method: 'POST',
      });
      await fetchDashboard();
      setActionMessage('Report analyzed successfully.');
    } catch (err) {
      setActionMessage(err.message || 'Failed to analyze report.');
    }
  };

  const handleExplainPrescription = async (prescriptionId) => {
    try {
      setActionMessage('Explaining prescription...');
      await fetchWithAuth(`/api/v1/prescriptions/explain/${prescriptionId}`, {
        method: 'POST',
      });
      await fetchDashboard();
      setActionMessage('Prescription explained successfully.');
    } catch (err) {
      setActionMessage(err.message || 'Failed to explain prescription.');
    }
  };

  const stats = useMemo(() => {
    if (!dashboardData?.stats) {
      return [];
    }

    const entries = dashboardData.stats;
    return [
      {
        label: 'Total reports',
        value: entries.totalReports,
        icon: FileText,
      },
      {
        label: 'Analyzed reports',
        value: entries.analyzedReports,
        icon: Activity,
      },
      {
        label: 'Pending analysis',
        value: entries.pendingReports,
        icon: FlaskConical,
      },
      {
        label: 'Total prescriptions',
        value: entries.totalPrescriptions,
        icon: Syringe,
      },
      {
        label: 'Medicines explained',
        value: entries.medicinesExplained,
        icon: Stethoscope,
      },
      {
        label: 'Metrics tracked',
        value: entries.totalMetricsTracked,
        icon: Activity,
      },
    ];
  }, [dashboardData]);

  const statusBars = useMemo(() => {
    if (!dashboardData?.trends?.statusDistribution) {
      return [];
    }

    return dashboardData.trends.statusDistribution.map((entry) => ({
      status: entry.status,
      count: entry.count,
    }));
  }, [dashboardData]);

  const alertToneMap = {
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    alert: 'border-rose-200 bg-rose-50 text-rose-800',
    info: 'border-sky-200 bg-sky-50 text-sky-800',
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-gradient-to-br from-[#f4f0ea] via-white to-[#eef6ff] text-slate-900">
        <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-[#d9e7ff] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-32 h-96 w-96 rounded-full bg-[#ffd9c7] opacity-40 blur-3xl" />
        <nav className="relative z-10 border-b border-white/60 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Health Command Center</p>
              <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">Signed in as</p>
                <p className="text-sm font-medium">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 py-8">
          <header className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Welcome back, {user?.name}.</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Track your latest reports, prescriptions, and health trends in one place.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
              {actionMessage && (
                <p className="mt-4 rounded-full bg-slate-900/5 px-4 py-2 text-xs font-semibold text-slate-700">
                  {actionMessage}
                </p>
              )}
              {error && (
                <p className="mt-4 rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700">
                  {error}
                </p>
              )}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_30px_60px_rgba(15,23,42,0.2)]">
              <p className="text-sm text-slate-300">Profile</p>
              <h3 className="mt-2 text-xl font-semibold">{user?.email}</h3>
              <p className="mt-2 text-xs text-slate-400">User ID</p>
              <p className="text-xs text-slate-200">{user?.id}</p>
              <div className="mt-6 flex items-center gap-3 text-xs text-slate-300">
                <div className="rounded-full bg-slate-800 px-3 py-1">Phase 6 Active</div>
                <div className="rounded-full bg-slate-800 px-3 py-1">AI Ready</div>
              </div>
            </div>
          </header>

          <section className="grid gap-4 lg:grid-cols-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {stat.label}
                    </p>
                    <Icon className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="mt-3 text-2xl font-semibold">
                    {isLoading ? '...' : stat.value}
                  </p>
                </div>
              );
            })}
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Health metrics</p>
                  <h3 className="text-lg font-semibold">Hemoglobin & glucose trends</h3>
                </div>
                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">7 day view</div>
              </div>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData?.trends?.hemoglobin || []}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tickFormatter={formatDate} stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      formatter={(value) => [value, 'Hemoglobin']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData?.trends?.glucose || []}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tickFormatter={formatDate} stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      formatter={(value) => [value, 'Glucose']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status mix</p>
                <h3 className="text-lg font-semibold">Metric distribution</h3>
                <div className="mt-4 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusBars} barSize={26}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="status" stroke="#94a3b8" />
                      <YAxis allowDecimals={false} stroke="#94a3b8" />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        radius={[8, 8, 0, 0]}
                        fill="#4f46e5"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Multi-metric</p>
                <h3 className="text-lg font-semibold">Normalized overview</h3>
                <div className="mt-4 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData?.trends?.combined || []}>
                      <defs>
                        <linearGradient id="hemoglobinFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="glucoseFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tickFormatter={formatDate} stroke="#94a3b8" />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value, name) => [value, name === 'hemoglobin' ? 'Hemoglobin' : 'Glucose']}
                      />
                      <Area
                        type="monotone"
                        dataKey="hemoglobin"
                        stroke="#3b82f6"
                        fill="url(#hemoglobinFill)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="glucose"
                        stroke="#f97316"
                        fill="url(#glucoseFill)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent reports</p>
                  <h3 className="text-lg font-semibold">Latest report uploads</h3>
                </div>
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500"
                  onClick={() => router.push('/dashboard?panel=reports')}
                >
                  View all
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                {(dashboardData?.recentReports || []).map((report) => {
                  const isAnalyzed = Boolean(report.summary);
                  return (
                    <div
                      key={report.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/80 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {report.report_name || 'Untitled report'}
                        </p>
                        <p className="text-xs text-slate-500">
                          Uploaded {formatDateFull(report.created_at)} • {report.metricCount} metrics
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isAnalyzed
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {isAnalyzed ? 'Analyzed' : 'Pending'}
                        </span>
                        <button
                          onClick={() =>
                            isAnalyzed
                              ? router.push(`/dashboard?report=${report.id}`)
                              : handleAnalyzeReport(report.id)
                          }
                          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                        >
                          {isAnalyzed ? 'View details' : 'Analyze'}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {dashboardData?.recentReports?.length === 0 && (
                  <p className="text-sm text-slate-500">No reports yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest health alerts</p>
              <h3 className="text-lg font-semibold">Watchlist</h3>
              <div className="mt-4 grid gap-3">
                {(dashboardData?.alerts || []).map((alert, index) => (
                  <div
                    key={`${alert.title}-${index}`}
                    className={`rounded-2xl border p-3 text-xs ${alertToneMap[alert.tone] || alertToneMap.info}`}
                  >
                    <p className="font-semibold">{alert.title}</p>
                    <p className="text-xs opacity-80">{alert.message}</p>
                  </div>
                ))}
                {dashboardData?.alerts?.length === 0 && (
                  <p className="text-sm text-slate-500">No alerts detected.</p>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent prescriptions</p>
                  <h3 className="text-lg font-semibold">Latest uploads</h3>
                </div>
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500"
                  onClick={() => router.push('/dashboard?panel=prescriptions')}
                >
                  View all
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                {(dashboardData?.recentPrescriptions || []).map((prescription) => {
                  const explained = prescription.medicineCount > 0;
                  return (
                    <div
                      key={prescription.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/80 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                          <img
                            src={prescription.file_url}
                            alt="Prescription"
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Uploaded {formatDateFull(prescription.created_at)}
                          </p>
                          <p className="text-sm font-semibold">
                            {prescription.medicineCount} medicines detected
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            explained
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {explained ? 'Explained' : 'Pending'}
                        </span>
                        <button
                          onClick={() =>
                            explained
                              ? router.push(`/dashboard?prescription=${prescription.id}`)
                              : handleExplainPrescription(prescription.id)
                          }
                          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                        >
                          {explained ? 'View medicines' : 'Explain'}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {dashboardData?.recentPrescriptions?.length === 0 && (
                  <p className="text-sm text-slate-500">No prescriptions yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-slate-900 p-6 text-white shadow-[0_25px_60px_rgba(15,23,42,0.25)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quick actions</p>
              <h3 className="text-lg font-semibold">Your next steps</h3>
              <div className="mt-6 grid gap-3">
                <button
                  onClick={() => router.push('/dashboard?panel=upload-report')}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold"
                >
                  Upload report
                  <Upload className="h-4 w-4" />
                </button>
                <button
                  onClick={() => router.push('/dashboard?panel=upload-prescription')}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold"
                >
                  Upload prescription
                  <Syringe className="h-4 w-4" />
                </button>
                <button
                  onClick={() => router.push('/chat')}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold"
                >
                  Ask AI assistant
                  <MessagesSquare className="h-4 w-4" />
                </button>
                <button
                  onClick={() => router.push('/voice')}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold"
                >
                  Voice assistant
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
