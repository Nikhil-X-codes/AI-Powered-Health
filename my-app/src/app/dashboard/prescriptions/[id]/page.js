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
import {
  ArrowLeft, ExternalLink, Pill, MessagesSquare,
  ChevronDown, ChevronUp, AlertTriangle, Clock, Syringe,
} from 'lucide-react';

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function MedicineCard({ medicine }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
      role="region"
      aria-label={`Medicine: ${medicine.medicine_name || 'Unknown'}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} details for ${medicine.medicine_name || 'medicine'}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
            <Pill className="h-5 w-5 text-violet-500" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{medicine.medicine_name || 'Unknown Medicine'}</p>
            {medicine.dosage_info && (
              <p className="mt-0.5 text-xs text-slate-500">{medicine.dosage_info}</p>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4.5 w-4.5 shrink-0 text-slate-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4.5 w-4.5 shrink-0 text-slate-400" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-4 animate-fade-in-up">
          {medicine.usage_info && (
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Usage Instructions</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{medicine.usage_info}</p>
            </div>
          )}
          {medicine.dosage_info && (
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Syringe className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dosage</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{medicine.dosage_info}</p>
            </div>
          )}
          {medicine.side_effects && (
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Side Effects</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{medicine.side_effects}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PrescriptionDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const fetchWithAuth = useAuthenticatedFetch();
  const toast = useToast();

  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExplaining, setIsExplaining] = useState(false);

  const loadPrescription = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth('/api/v1/prescriptions');
      const found = (data.prescriptions || []).find((p) => p.id === id);
      if (!found) { toast.error('Prescription not found'); router.push('/dashboard/prescriptions'); return; }
      setPrescription(found);
    } catch {
      toast.error('Failed to load prescription');
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithAuth, id, router, toast]);

  useEffect(() => { loadPrescription(); }, [loadPrescription]);

  const handleExplain = async () => {
    try {
      setIsExplaining(true);
      await fetchWithAuth(`/api/v1/prescriptions/explain/${id}`, { method: 'POST' });
      toast.success('Prescription explained successfully');
      await loadPrescription();
    } catch (err) {
      toast.error(err.message || 'Explanation failed');
    } finally {
      setIsExplaining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!prescription) return null;

  const medicines = prescription.medicines || [];
  const isExplained = medicines.length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
      <Breadcrumbs items={[
        { label: 'Prescriptions', href: '/dashboard/prescriptions' },
        { label: `Prescription — ${formatDate(prescription.created_at)}` },
      ]} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            onClick={() => router.push('/dashboard/prescriptions')}
            className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-700"
            aria-label="Back to prescriptions list"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Prescriptions
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Prescription</h1>
          <p className="mt-1 text-sm text-slate-500">Uploaded on {formatDate(prescription.created_at)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusBadge status={isExplained ? 'Explained' : 'Pending'} showDot />
          {prescription.file_url && (
            <a
              href={prescription.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              aria-label="View original prescription file"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              View File
            </a>
          )}
        </div>
      </div>

      {/* Image preview */}
      {prescription.file_url && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {prescription.file_url.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
            <img
              src={prescription.file_url}
              alt="Prescription image"
              className="max-h-96 w-full object-contain bg-slate-50"
            />
          ) : (
            <div className="flex items-center justify-center bg-slate-50 py-16">
              <a href={prescription.file_url} target="_blank" rel="noopener noreferrer" className="btn-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white">
                Open PDF
              </a>
            </div>
          )}
        </div>
      )}

      {/* Action */}
      {!isExplained && (
        <div className="flex flex-wrap gap-3">
          <Button icon={Pill} loading={isExplaining} onClick={handleExplain} aria-label="Run AI explanation on this prescription">
            Explain Prescription
          </Button>
          <Button variant="secondary" icon={MessagesSquare} onClick={() => router.push('/chat')}>
            Ask AI about this
          </Button>
        </div>
      )}

      {/* Medicines */}
      {medicines.length > 0 ? (
        <section aria-label="Medicines list">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Medicines ({medicines.length})</h2>
          <div className="space-y-3">
            {medicines.map((med) => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
        </section>
      ) : isExplained ? null : (
        <EmptyState
          illustration="prescription"
          title="Not yet explained"
          description="Click 'Explain Prescription' to let AI identify medicines, dosages, and side effects."
        />
      )}

      {isExplained && (
        <div className="flex justify-center pt-4">
          <Button variant="secondary" icon={MessagesSquare} onClick={() => router.push('/chat')}>
            Ask AI about these medicines
          </Button>
        </div>
      )}
    </div>
  );
}
