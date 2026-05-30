import { proxyFormData } from '@/lib/backend/proxy';

export async function POST(req) {
  return proxyFormData(req, '/ocr/extract-detailed');
}