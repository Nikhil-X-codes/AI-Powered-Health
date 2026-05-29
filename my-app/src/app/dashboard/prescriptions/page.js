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
import { Syringe, Plus, Calendar, Pill, Loader2 } from 'lucide-react';

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PrescriptionsPage() {
  const router = useRouter();
  const fetchWithAuth = useAuthenticatedFetch();
  const toast = useToast();

  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [explainingId, setExplainingId] = useState(null);

  const loadPrescriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth('/api/v1/prescriptions');
      setPrescriptions(data.prescriptions || []);
    } catch {
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth, toast]);

  useEffect(() => { loadPrescriptions(); }, [loadPrescriptions]);

  const handleUpload = async () => {
    if (!uploadFile) { toast.warning('Select a file first'); return; }
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('prescription', uploadFile);
      await fetchWithAuth('/api/v1/prescriptions/upload', { method: 'POST', body: formData });
      toast.success('Prescription uploaded successfully');
      setShowUpload(false);
      setUploadFile(null);
      await loadPrescriptions();
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExplain = async (prescriptionId) => {
    try {
      setExplainingId(prescriptionId);
      await fetchWithAuth(`/api/v1/prescriptions/explain/${prescriptionId}`, { method: 'POST' });
      toast.success('Prescription explained successfully');
      await loadPrescriptions();
    } catch (err) {
      toast.error(err.message || 'Explanation failed');
    } finally {
      setExplainingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: 'Prescriptions' }]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
          <p className="mt-1 text-sm text-slate-500">
            {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowUpload(true)} aria-label="Upload new prescription">
          Upload Prescription
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : prescriptions.length === 0 ? (
        <EmptyState
          illustration="prescription"
          title="No prescriptions uploaded yet"
          description="Upload a prescription image to let AI identify medicines, explain dosages, and highlight side effects."
          actionLabel="Upload Prescription"
          onAction={() => setShowUpload(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prescriptions.map((rx) => {
            const isExplained = (rx.medicines?.length || 0) > 0;
            const medicineCount = rx.medicines?.length || 0;
            return (
              <article
                key={rx.id}
                className="group rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5 overflow-hidden cursor-pointer"
                onClick={() => router.push(`/dashboard/prescriptions/${rx.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`Prescription from ${formatDate(rx.created_at)} — ${isExplained ? 'Explained' : 'Pending'} — ${medicineCount} medicines`}
                onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/dashboard/prescriptions/${rx.id}`); }}
              >
                {/* Thumbnail */}
                {rx.file_url && rx.file_url.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
                  <div className="h-36 bg-slate-100 overflow-hidden">
                    <img
                      src={rx.file_url}
                      alt={`Prescription from ${formatDate(rx.created_at)}`}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
                    <Syringe className="h-10 w-10 text-violet-300" aria-hidden="true" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-900">Prescription</p>
                    <StatusBadge status={isExplained ? 'Explained' : 'Pending'} showDot />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      {formatDate(rx.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Pill className="h-3 w-3" aria-hidden="true" />
                      {medicineCount} medicine{medicineCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isExplained ? router.push(`/dashboard/prescriptions/${rx.id}`) : handleExplain(rx.id);
                    }}
                    disabled={explainingId === rx.id}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                    aria-label={isExplained ? 'View medicine details' : 'Explain this prescription'}
                  >
                    {explainingId === rx.id && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                    {isExplained ? 'View Medicines' : 'Explain'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Upload modal */}
      <Modal
        isOpen={showUpload}
        onClose={() => { setShowUpload(false); setUploadFile(null); }}
        title="Upload Prescription"
        description="Upload a photo or PDF of your prescription."
      >
        <div className="space-y-4">
          <FileDropzone
            onFileSelect={setUploadFile}
            file={uploadFile}
            onClear={() => setUploadFile(null)}
            label="Drop your prescription here"
            hint="JPEG, PNG, or PDF up to 50MB"
            id="upload-prescription-dropzone"
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowUpload(false); setUploadFile(null); }}>
              Cancel
            </Button>
            <Button icon={Plus} loading={isUploading} onClick={handleUpload} aria-label="Upload prescription file">
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
