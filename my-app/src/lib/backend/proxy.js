import { getAuthenticatedUser, getRequestToken } from '@/lib/backend/auth';

function getFastApiBaseUrl() {
  const url = process.env.FASTAPI_URL || process.env.AI_SERVICE_URL;
  
  if (!url) {
    throw new Error(
      'FASTAPI_URL or AI_SERVICE_URL must be set in environment variables'
    );
  }
  
  return url.replace('://localhost', '://127.0.0.1').replace(/\/$/, '');
}

function upstreamUnavailableResponse(path, error) {
  return new Response(
    JSON.stringify({
      error: 'FastAPI service unavailable',
      detail: error?.message || 'Unable to reach upstream service',
      upstream: `${getFastApiBaseUrl()}${path}`,
    }),
    {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: 'Unauthorized' }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function getForwardAuthHeaders(req) {
  const user = getAuthenticatedUser(req);

  if (!user) {
    return null;
  }

  const headers = {
    'x-user-id': String(user.userId),
    'x-user-email': String(user.email),
  };

  const token = getRequestToken(req);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function proxyJson(req, fastapiPath) {
  const authHeaders = getForwardAuthHeaders(req);
  if (!authHeaders) {
    return unauthorizedResponse();
  }

  const body = await req.json();

  let res;
  try {
    res = await fetch(`${getFastApiBaseUrl()}${fastapiPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    return upstreamUnavailableResponse(fastapiPath, error);
  }

  const contentType = res.headers.get('content-type') || 'application/json';

  if (!contentType.includes('application/json')) {
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function proxyFormData(req, fastapiPath) {
  const authHeaders = getForwardAuthHeaders(req);
  if (!authHeaders) {
    return unauthorizedResponse();
  }

  const formData = await req.formData();

  let res;
  try {
    res = await fetch(`${getFastApiBaseUrl()}${fastapiPath}`, {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    });
  } catch (error) {
    return upstreamUnavailableResponse(fastapiPath, error);
  }

  const contentType = res.headers.get('content-type') || 'application/json';

  if (contentType.includes('audio') || contentType.includes('octet-stream')) {
    const buffer = await res.arrayBuffer();
    return new Response(buffer, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    });
  }

  if (!contentType.includes('application/json')) {
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}