import { getAuthenticatedUser, getRequestToken } from '@/lib/backend/auth';

function getFastApiBaseUrl() {
  const url = process.env.FASTAPI_URL || process.env.AI_SERVICE_URL;

  if (!url) {
    throw new Error('FASTAPI_URL or AI_SERVICE_URL must be set in environment variables');
  }

  return url.replace('://localhost', '://127.0.0.1').replace(/\/$/, '');
}

function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

function normalizeSources(sources = []) {
  const seen = new Set();

  return sources.flatMap((source, index) => {
    const metadata = source?.metadata || {};
    const type = metadata.source || metadata.source_type || metadata.type || 'knowledge';
    const id = metadata.report_id || metadata.prescription_id || metadata.source_id || metadata.id;
    const label = metadata.report_name || metadata.display_name || metadata.medicine_name || source?.title || type;
    const key = `${type}:${id || label || index}`;

    if (seen.has(key)) {
      return [];
    }

    seen.add(key);
    return [{ type, id, label }];
  });
}

export async function POST(req) {
  try {
    const body = await req.json();

    const user = getAuthenticatedUser(req);
    if (!user) {
      return unauthorizedResponse();
    }

    const question = String(body?.question || body?.message || body?.prompt || '').trim();
    if (!question) {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (body?.user_id && String(body.user_id) !== String(user.userId)) {
      return new Response(JSON.stringify({ error: 'Forbidden - user_id does not match the authenticated user' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const reportId = body?.report_id || body?.prescription_id || body?.document_id || null;

    if (!reportId) {
      return new Response(JSON.stringify({ error: 'Please select a report or prescription first' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = {
      question,
      user_id: String(user.userId),
      report_id: reportId,
      top_k: body?.top_k || 4,
      temperature: body?.temperature || 0.2,
      max_tokens: body?.max_tokens || 800,
    };

    const token = getRequestToken(req);
    const upstream = await fetch(`${getFastApiBaseUrl()}/chat/rag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const contentType = upstream.headers.get('content-type') || 'application/json';

    if (!contentType.includes('application/json')) {
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: { 'Content-Type': contentType },
      });
    }

    const data = await upstream.json();
    const sources = normalizeSources(Array.isArray(data?.sources) ? data.sources : []);
    const contextMode = Array.isArray(data?.sources) && data.sources.length === 0 ? 'general' : 'personal';

    return new Response(JSON.stringify({
      ...data,
      sources,
      contextMode,
    }), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Next.js RAG] Error:', error);
    return new Response(JSON.stringify({ error: 'Chat failed', detail: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
