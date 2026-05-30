import { proxyFormData } from '@/lib/backend/proxy';

export async function POST(request) {
  return proxyFormData(request, '/voice');
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: 'POST, OPTIONS' },
  });
}
