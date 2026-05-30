import { getAuthenticatedUser } from '@/lib/backend/auth';
import { getForwardAuthHeaders, proxyJson } from '@/lib/backend/proxy';

function normalizeSource(source) {
  const rawSource = String(source || '').toLowerCase();

  if (rawSource.includes('prescription')) return 'prescription';
  if (rawSource.includes('medical_kb')) return 'medical_kb';
  return 'report';
}

function buildDocumentsPayload(body, userId) {
  if (Array.isArray(body?.documents)) {
    return body.documents.map((document, index) => ({
      ...document,
      metadata: {
        ...(document?.metadata || {}),
        user_id: String(userId),
        source: normalizeSource(document?.metadata?.source || body.source),
        report_id: document?.metadata?.report_id || body.report_id || null,
        prescription_id: document?.metadata?.prescription_id || body.prescription_id || null,
      },
      id: document?.id || body.report_id || body.prescription_id || `document-${index + 1}`,
    }));
  }

  if (Array.isArray(body?.texts)) {
    const source = normalizeSource(body.source);

    return body.texts.map((text, index) => ({
      text,
      metadata: {
        user_id: String(userId),
        source,
        report_id: body.report_id || null,
        prescription_id: body.prescription_id || null,
      },
      id: body.report_id || body.prescription_id || `${source}-${index + 1}`,
    }));
  }

  return null;
}

export async function POST(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await req.clone().json();
    if (body?.user_id && String(body.user_id) !== String(user.userId)) {
      return new Response(JSON.stringify({ error: 'Forbidden - user_id does not match the authenticated user' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const documents = buildDocumentsPayload(body, user.userId);
    if (!documents || documents.length === 0) {
      return new Response(JSON.stringify({ error: 'documents or texts are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = {
      documents,
      chunk_size: body?.chunk_size || 500,
      overlap: body?.overlap || 50,
    };

    const authHeaders = getForwardAuthHeaders(req);
    const proxyReq = new Request(req.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(payload),
    });

    return proxyJson(proxyReq, '/embed/store');
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to store embeddings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}