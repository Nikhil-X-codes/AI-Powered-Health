import { proxyJson } from '@/lib/backend/proxy';

export async function POST(req) {
  return proxyJson(req, '/embed/single');
}