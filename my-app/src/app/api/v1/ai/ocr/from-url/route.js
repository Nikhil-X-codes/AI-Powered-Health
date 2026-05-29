const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

async function proxy(request, targetPath) {
  const url = new URL(AI_SERVICE_URL.replace(/\/$/, '') + targetPath);
  url.search = new URL(request.url).search;

  const forwarded = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow',
  });

  const res = await fetch(forwarded);
  const headers = new Headers(res.headers);
  headers.delete('transfer-encoding');
  return new Response(res.body, { status: res.status, headers });
}

export async function POST(request) { return proxy(request, '/ocr/from-url'); }
export async function OPTIONS(request) { return proxy(request, '/ocr/from-url'); }
