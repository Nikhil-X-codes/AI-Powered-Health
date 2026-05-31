import { requireAuth } from '@/lib/api-auth';

const DEFAULT_FASTAPI_URL = 'http://127.0.0.1:8000';

function getFastApiBaseUrl() {
  const configured = process.env.FASTAPI_URL || process.env.AI_SERVICE_URL || DEFAULT_FASTAPI_URL;

  return configured.replace('://localhost', '://127.0.0.1').replace(/\/$/, '');
}

export async function POST(req) {
  const { isValid } = requireAuth(req);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await req.json();
  const question = body?.question;

  const searchParams = new URLSearchParams();
  if (question !== undefined) {
    searchParams.set('question', question);
  }

  const upstreamUrl = `${getFastApiBaseUrl()}/chat/quick${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  try {
    const response = await fetch(upstreamUrl, { method: 'POST' });
    const contentType = response.headers.get('content-type') || 'application/json';

    if (!contentType.includes('application/json')) {
      const text = await response.text();
      return new Response(text, {
        status: response.status,
        headers: { 'Content-Type': contentType },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'FastAPI service unavailable',
        detail: error?.message || 'Unable to reach upstream service',
        upstream: upstreamUrl,
      }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}