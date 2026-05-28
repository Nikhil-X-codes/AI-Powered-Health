import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';

const FASTAPI_BASE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function fetchWithTimeout(url, options = {}, timeoutMs = 60_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request) {
  try {
    const { isValid, user } = requireAuth(request);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID not found' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const audio = formData.get('audio');
    const reportId = formData.get('report_id');

    if (!audio) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    const forwardData = new FormData();
    forwardData.append('audio_file', audio, 'voice.webm');
    forwardData.append('user_id', user.userId);
    if (reportId) {
      forwardData.append('report_id', reportId);
    }

    const response = await fetchWithTimeout(
      `${FASTAPI_BASE_URL}/voice`,
      {
        method: 'POST',
        body: forwardData,
      },
      90_000
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('FastAPI voice error:', errorText);
      return NextResponse.json(
        { error: 'Failed to process voice request' },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      {
        success: true,
        transcription: data.transcription,
        answer: data.answer,
        audio: data.audio,
        audioMime: data.audio_mime,
        sources: data.sources || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Voice endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice request' },
      { status: 500 }
    );
  }
}
