import { getForwardAuthHeaders, proxyJson } from '@/lib/backend/proxy';

export async function POST(req) {
  const body = await req.json();
  // Accept client `url` field and rename to `file_url` expected by FastAPI
  const payload = { ...body };
  if (body?.url && !body?.file_url) {
    payload.file_url = body.url;
    delete payload.url;
  }

  const authHeaders = getForwardAuthHeaders(req);
  if (!authHeaders) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const proxyReq = new Request(req.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });

  return proxyJson(proxyReq, '/ocr/from-url');
}