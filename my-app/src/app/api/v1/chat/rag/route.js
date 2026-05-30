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
  const user = getAuthenticatedUser(req);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = await req.json();
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

  const token = getRequestToken(req);
  const upstream = await fetch(`${getFastApiBaseUrl()}/chat/rag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      question,
      user_id: String(user.userId),
      report_id: body?.report_id || null,
      top_k: body?.top_k || 5,
    }),
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
}