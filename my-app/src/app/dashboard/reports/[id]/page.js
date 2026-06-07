'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { useToast } from '@/components/ui/Toast';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import {
  ArrowLeft, ExternalLink, ScanSearch, MessagesSquare,
  TrendingUp, AlertTriangle, CheckCircle, Info, Trash2,
} from 'lucide-react';
import {
  Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const STATUS_ICON = {
  Normal: CheckCircle,
  High: AlertTriangle,
  Low: AlertTriangle,
  Borderline: Info,
};

const STATUS_COLOR = {
  Normal: 'text-emerald-500',
  High: 'text-rose-500',
  Low: 'text-amber-500',
  Borderline: 'text-orange-500',
};

export default function ReportDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const fetchWithAuth = useAuthenticatedFetch();
  const toast = useToast();

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [trends, setTrends] = useState([]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setShowDeleteModal(false);
      await fetchWithAuth(`/api/v1/reports/${id}`, { method: 'DELETE' });
      toast.success('Report deleted successfully');
      router.push('/dashboard/reports');
    } catch (err) {
      toast.error(err.message || 'Failed to delete report');
    } finally {
      setIsDeleting(false);
    }
  };

  const loadReport = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth('/api/v1/reports');
      const found = (data.reports || []).find((r) => r.id === id);
      if (!found) { toast.error('Report not found'); router.push('/dashboard/reports'); return; }
      setReport(found);
    } catch {
      toast.error('Failed to load report');
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth, id, router, toast]);

  useEffect(() => { loadReport(); }, [loadReport]);

  // Load trend data when report is loaded
  useEffect(() => {
    if (!report || !report.summary) return;
    let cancelled = false;
    const loadTrends = async () => {
      try {
        const data = await fetchWithAuth(`/api/v1/reports/${id}/trends`);
        if (!cancelled && data?.trends) {
          setTrends(data.trends);
        }
      } catch {
        // Trends are optional — fail silently
      }
    };
    void loadTrends();
    return () => { cancelled = true; };
  }, [report, id, fetchWithAuth]);

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      await fetchWithAuth(`/api/v1/reports/analyze/${id}`, { method: 'POST' });
      toast.success('Report analyzed successfully');
      await loadReport();
    } catch (err) {
      toast.error(err.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!report) return null;

  const isAnalyzed = !!report.summary;
  const metrics = report.health_metrics || [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
      <Breadcrumbs items={[
        { label: 'Reports', href: '/dashboard/reports' },
        { label: report.report_name || 'Report Detail' },
      ]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            onClick={() => router.push('/dashboard/reports')}
            className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-700"
            aria-label="Back to reports list"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Reports
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{report.report_name || 'Untitled Report'}</h1>
          <p className="mt-1 text-sm text-slate-500">Uploaded on {formatDate(report.created_at)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusBadge status={isAnalyzed ? 'Analyzed' : 'Pending'} showDot />
           {report.file_url && (
            <a
              href={report.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              aria-label="View original report file"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              View File
            </a>
          )}
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            loading={isDeleting}
            onClick={() => setShowDeleteModal(true)}
            aria-label="Delete report"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Preview image/PDF */}
      {report.file_url && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {report.file_url.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
            <img
              src={report.file_url}
              alt={`Preview of ${report.report_name || 'medical report'}`}
              className="max-h-96 w-full object-contain bg-slate-50"
            />
          ) : (
            <div className="flex items-center justify-center bg-slate-50 py-16">
              <a
                href={report.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white"
              >
                Open PDF in new tab
              </a>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {report.summary && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-2">AI Summary</p>
          <p className="text-sm leading-relaxed text-emerald-900">{report.summary}</p>
        </div>
      )}

      {/* Action buttons */}
      {!isAnalyzed && (
        <div className="flex flex-wrap gap-3">
          <Button icon={ScanSearch} loading={isAnalyzing} onClick={handleAnalyze} aria-label="Run AI analysis on this report">
            Analyze Report
          </Button>
          <Button variant="secondary" icon={MessagesSquare} onClick={() => router.push(`/chat?report_id=${id}`)}>
            Ask AI about this
          </Button>
        </div>
      )}

      {/* Health Metrics */}
      {metrics.length > 0 && (
        <section aria-label="Health metrics">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Health Metrics ({metrics.length})</h2>
            {isAnalyzed && (
              <Button variant="secondary" size="sm" icon={MessagesSquare} onClick={() => router.push(`/chat?report_id=${id}`)}>
                Ask AI
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => {
              const StatusIcon = STATUS_ICON[metric.status] || Info;
              const statusColor = STATUS_COLOR[metric.status] || 'text-slate-500';
              return (
                <div
                  key={metric.id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md cursor-pointer"
                  onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={selectedMetric === metric.id}
                  aria-label={`${metric.metric_name}: ${metric.metric_value} — Status: ${metric.status}`}
                  onKeyDown={(e) => { if (e.key === 'Enter') setSelectedMetric(selectedMetric === metric.id ? null : metric.id); }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{metric.metric_name || 'Unknown'}</p>
                    <StatusIcon className={`h-4.5 w-4.5 ${statusColor}`} aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{metric.metric_value || '—'}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusBadge status={metric.status || 'Normal'} showDot />
                  </div>

                  {/* Expanded explanation */}
                  {selectedMetric === metric.id && metric.explanation && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 animate-fade-in-up border border-slate-100">
                      {metric.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {isAnalyzed && metrics.length === 0 && (
        <EmptyState
          illustration="health"
          title="No metrics extracted"
          description="The AI analysis didn't find measurable health metrics in this report."
          actionLabel="Ask AI"
          onAction={() => router.push('/chat')}
        />
      )}

      {/* Metric Trends */}
      {trends.length > 0 && (
        <section aria-label="Metric trends">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-slate-900">Metric Trends</h2>
            <span className="text-xs text-slate-500 ml-1">(across all your reports)</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {trends.map((trend) => {
              const chartData = trend.points.map((p) => ({
                date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: p.value,
                status: p.status,
                reportName: p.reportName || 'Report',
                isCurrent: p.isCurrent,
              }));
              const metricLabel = (trend.metricName || 'Metric')
                .replace(/[_-]+/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase());
              return (
                <div
                  key={trend.metricName}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <p className="mb-3 text-sm font-semibold text-slate-900">{metricLabel}</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}
                        formatter={(value, name, props) => [
                          `${value} — ${props.payload.status || 'Unknown'}`,
                          props.payload.reportName,
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={(dotProps) => {
                          const { cx, cy, payload } = dotProps;
                          const color = payload.status === 'Normal'
                            ? '#10b981'
                            : payload.status === 'High'
                              ? '#ef4444'
                              : payload.status === 'Low'
                                ? '#f59e0b'
                                : '#6366f1';
                          return (
                            <circle
                              key={`dot-${cx}-${cy}`}
                              cx={cx}
                              cy={cy}
                              r={payload.isCurrent ? 6 : 4}
                              fill={color}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          );
                        }}
                        activeDot={{ r: 7, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Normal</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-rose-500" /> High</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Low</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-indigo-500" /> Borderline</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Report"
        description="Are you sure you want to delete this report? This action cannot be undone."
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            <p className="font-semibold">Warning:</p>
            <p className="mt-0.5 text-xs opacity-90">
              This will permanently delete this report and all associated health metrics.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={isDeleting} onClick={handleDelete} aria-label="Confirm report deletion">
              Delete Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
