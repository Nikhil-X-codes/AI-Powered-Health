import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

const FASTAPI_BASE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function fetchWithTimeout(url, options = {}, timeoutMs = 45_000) {
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

export async function GET(request) {
  try {
    const { isValid, user } = requireAuth(request);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID not found' },
        { status: 401 }
      );
    }

    const messages = await prisma.chat_history.findMany({
      where: { user_id: user.userId },
      orderBy: { created_at: 'asc' },
      take: 50,
    });

    return NextResponse.json(
      {
        success: true,
        messages: messages.map((message) => ({
          id: message.id,
          userMessage: message.user_message,
          aiResponse: message.ai_response,
          createdAt: message.created_at,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json(
      { error: 'Failed to load chat history' },
      { status: 500 }
    );
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

    const body = await request.json();
    const question = body?.message;
    const reportId = body?.report_id;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const ragResponse = await fetchWithTimeout(
      `${FASTAPI_BASE_URL}/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          user_id: user.userId,
          report_id: reportId || null,
        }),
      },
      60_000
    );

    if (!ragResponse.ok) {
      const errorText = await ragResponse.text();
      console.error('FastAPI RAG error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate answer' },
        { status: 500 }
      );
    }

    const ragData = await ragResponse.json();

    await prisma.chat_history.create({
      data: {
        user_id: user.userId,
        user_message: question,
        ai_response: ragData.answer,
      },
    });

    return NextResponse.json(
      {
        success: true,
        answer: ragData.answer,
        sources: ragData.sources || [],
        model: ragData.model,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat RAG error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
