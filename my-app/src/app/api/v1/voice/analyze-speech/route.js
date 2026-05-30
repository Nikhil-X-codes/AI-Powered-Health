import { proxyFormData } from '@/lib/backend/proxy';

export async function POST(req) {
  return proxyFormData(req, '/voice/analyze-speech');
}