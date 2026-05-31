import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { getFastApiBaseUrl } from '@/lib/fastapi';

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

function formatMonthYear(value) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function buildSourceLabel(source) {
  const monthYear = formatMonthYear(source.created_at);
  const baseLabel = source.type === 'report'
    ? source.report_name || 'Medical Report'
    : 'Prescription';

  return monthYear ? `${baseLabel} ${monthYear}` : baseLabel;
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
    const fastApiBaseUrl = getFastApiBaseUrl();

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const ragResponse = await fetchWithTimeout(
      `${fastApiBaseUrl}/chat/rag`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          user_id: user.userId,
          top_k: 5,
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
    const sourceRefs = (ragData.sources || [])
      .map((source) => ({
        type: source?.metadata?.report_id ? 'report' : source?.metadata?.prescription_id ? 'prescription' : source?.metadata?.source || 'unknown',
        id: source?.metadata?.report_id || source?.metadata?.prescription_id || source?.metadata?.source_id || null,
      }))
      .filter((source) => source.id);

    const uniqueSourceRefs = Array.from(
      new Map(sourceRefs.map((source) => [`${source.type}:${source.id}`, source])).values()
    );

    const reportIds = uniqueSourceRefs.filter((source) => source.type === 'report').map((source) => source.id);
    const prescriptionIds = uniqueSourceRefs.filter((source) => source.type === 'prescription').map((source) => source.id);

    const [reports, prescriptions] = await Promise.all([
      reportIds.length
        ? prisma.reports.findMany({
            where: {
              id: { in: reportIds },
              user_id: user.userId,
            },
          })
        : [],
      prescriptionIds.length
        ? prisma.prescriptions.findMany({
            where: {
              id: { in: prescriptionIds },
              user_id: user.userId,
            },
          })
        : [],
    ]);

    const sourceLookup = new Map();

    for (const report of reports) {
      sourceLookup.set(`report:${report.id}`, {
        type: 'report',
        id: report.id,
        label: buildSourceLabel(report),
      });
    }

    for (const prescription of prescriptions) {
      sourceLookup.set(`prescription:${prescription.id}`, {
        type: 'prescription',
        id: prescription.id,
        label: buildSourceLabel(prescription),
      });
    }

    const sources = uniqueSourceRefs.map((source) =>
      sourceLookup.get(`${source.type}:${source.id}`) || {
        type: source.type,
        id: source.id,
        label: source.type === 'report' ? 'Medical Report' : 'Prescription',
      }
    );

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
        response: ragData.answer,
        sources,
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
