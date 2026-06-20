import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { proxyFormData } from '@/lib/backend/proxy';

export async function POST(req) {
  try {
    const { isValid } = requireAuth(req);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Proxy the request to the FastAPI backend
    return await proxyFormData(req, '/ocr/extract');
  } catch (error) {
    console.error('OCR Proxy Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to extract OCR data' },
      { status: 500 }
    );
  }
}
