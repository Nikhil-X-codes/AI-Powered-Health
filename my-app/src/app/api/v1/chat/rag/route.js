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

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('[Next.js RAG] Raw body from frontend:', JSON.stringify(body, null, 2));

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
      console.error('[Next.js RAG] Missing report_id. Body keys:', Object.keys(body || {}));
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

    console.log('[Next.js RAG] Forwarding to FastAPI:', JSON.stringify(payload, null, 2));

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
    const contextMode = Array.isArray(data?.sources) && data.sources.length === 0 ? 'general' : 'personal';

    return new Response(JSON.stringify({
      ...data,
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