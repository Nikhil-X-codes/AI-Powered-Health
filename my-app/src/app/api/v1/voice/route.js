import { requireAuth } from '@/lib/api-auth';
import { getForwardAuthHeaders, proxyFormData } from '@/lib/backend/proxy';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const { isValid, user } = requireAuth(req);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const formData = await req.formData();
  const audio = formData.get('audio') || formData.get('audio_file');
  const reportId = formData.get('report_id');
  const prescriptionId = formData.get('prescription_id');

  const forwardData = new FormData();
  if (audio) forwardData.append('audio_file', audio, 'voice.webm');
  forwardData.append('user_id', String(user.userId));
  if (reportId) forwardData.append('report_id', reportId);
  if (prescriptionId) forwardData.append('prescription_id', prescriptionId);

  if (reportId) {
    const report = await prisma.reports.findUnique({
      where: { id: String(reportId) },
      select: { user_id: true },
    });

    if (!report) {
      return new Response(JSON.stringify({ error: 'Report not found' }), {

  if (prescriptionId) {
    const prescription = await prisma.prescriptions.findUnique({
      where: { id: String(prescriptionId) },
      select: { user_id: true },
    });

    if (!prescription) {
      return new Response(JSON.stringify({ error: 'Prescription not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (String(prescription.user_id) !== String(user.userId)) {
      return new Response(JSON.stringify({ error: 'Forbidden - prescription belongs to another user' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (String(report.user_id) !== String(user.userId)) {
      return new Response(JSON.stringify({ error: 'Forbidden - report belongs to another user' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const authHeaders = getForwardAuthHeaders(req);
  const proxyReq = new Request(req.url, {
    method: 'POST',
    headers: authHeaders || undefined,
    body: forwardData,
  });

  const response = await proxyFormData(proxyReq, '/voice');
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    return response;
  }

  const data = await response.json();
  const transcription = String(data?.transcription || '').trim();

  if (!transcription) {
    return new Response(JSON.stringify({ error: 'Voice transcription is empty. Please speak louder or rephrase your question.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    ...data,
    contextMode: Array.isArray(data?.sources) && data.sources.length === 0 ? 'general' : 'personal',
  }), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
