'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { useToast } from '@/components/ui/Toast';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { Modal } from '@/components/ui/Modal';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { FileText, Plus, Search, Calendar, ArrowUpDown, Loader2, ScanSearch } from 'lucide-react';

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ReportsPage() {
  const router = useRouter();
  const fetchWithAuth = useAuthenticatedFetch();
  const toast = useToast();

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortDesc, setSortDesc] = useState(true);
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [reportName, setReportName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);

  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth('/api/v1/reports');
      setReports(data.reports || []);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth, toast]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const handleUpload = async () => {
    if (!uploadFile) { toast.warning('Select a file first'); return; }
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('report', uploadFile);
      if (reportName.trim()) formData.append('report_name', reportName.trim());
      await fetchWithAuth('/api/v1/reports/upload', { method: 'POST', body: formData });
      toast.success('Report uploaded successfully');
      setShowUpload(false);
      setUploadFile(null);
      setReportName('');
      await loadReports();
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async (id) => {
    try {
      setAnalyzingId(id);
      await fetchWithAuth(`/api/v1/reports/analyze/${id}`, { method: 'POST' });
      toast.success('Report analyzed successfully');
      await loadReports();
    } catch (err) {
      toast.error(err.message || 'Analysis failed');
    } finally {
      setAnalyzingId(null);
    }
  };

  const filtered = reports
    .filter((r) => !search || (r.report_name || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const diff = new Date(b.created_at) - new Date(a.created_at);
      return sortDesc ? diff : -diff;
    });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: 'Reports' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Reports</h1>
          <p className="mt-1 text-sm text-slate-500">{reports.length} report{reports.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <Button icon={Plus} onClick={() => setShowUpload(true)} aria-label="Upload new report">
          Upload Report
        </Button>
      </div>

      {/* Search & filter bar */}
      {reports.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center" role="search">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              aria-label="Search reports by name"
            />
          </div>
          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
            aria-label={`Sort by date ${sortDesc ? 'ascending' : 'descending'}`}
          >
            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
            {sortDesc ? 'Newest first' : 'Oldest first'}
          </button>
        </div>
      )}

      {/* Reports list */}
      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : filtered.length === 0 && reports.length === 0 ? (
        <EmptyState
          illustration="report"
          title="No reports uploaded yet"
          description="Upload your first medical report to get AI-powered analysis, health metric tracking, and more."
          actionLabel="Upload Report"
          onAction={() => setShowUpload(true)}
        />
      ) : filtered.length === 0 ? (
        <EmptyState illustration="report" title="No matching reports" description={`No reports match "${search}".`} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((report) => {
            const isAnalyzed = !!report.summary;
            const metricCount = report.health_metrics?.length || 0;
            return (
              <article
                key={report.id}
                className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`${report.report_name || 'Untitled report'} — ${isAnalyzed ? 'Analyzed' : 'Pending'} — ${metricCount} metrics`}
                onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/dashboard/reports/${report.id}`); }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 transition group-hover:bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  </div>
                  <StatusBadge status={isAnalyzed ? 'Analyzed' : 'Pending'} showDot />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900 truncate">
                  {report.report_name || 'Untitled Report'}
                </h3>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {formatDate(report.created_at)}
                  </span>
                  <span>{metricCount} metric{metricCount !== 1 ? 's' : ''}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    isAnalyzed ? router.push(`/dashboard/reports/${report.id}`) : handleAnalyze(report.id);
                  }}
                  disabled={analyzingId === report.id}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                  aria-label={isAnalyzed ? `View analysis for ${report.report_name || 'report'}` : `Analyze ${report.report_name || 'report'}`}
                >
                  {analyzingId === report.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <ScanSearch className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {isAnalyzed ? 'View Analysis' : 'Analyze Report'}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Upload modal */}
      <Modal
        isOpen={showUpload}
        onClose={() => { setShowUpload(false); setUploadFile(null); setReportName(''); }}
        title="Upload Medical Report"
        description="Upload a PDF or image of your medical report for AI analysis."
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="upload-report-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Report name
            </label>
            <input
              id="upload-report-name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Blood Test May 2026"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <FileDropzone
            onFileSelect={setUploadFile}
            file={uploadFile}
            onClear={() => setUploadFile(null)}
            label="Drop your report here"
            id="upload-report-dropzone"
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowUpload(false); setUploadFile(null); setReportName(''); }}>
              Cancel
            </Button>
            <Button icon={Plus} loading={isUploading} onClick={handleUpload} aria-label="Upload report file">
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
