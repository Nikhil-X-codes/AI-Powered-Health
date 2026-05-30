import { proxyJson } from '@/lib/backend/proxy';

export async function POST(request) {
  return proxyJson(request, '/embed');
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: 'POST, OPTIONS' },
  });
}
