import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

export async function GET(request) {
  try {
    const { isValid, user } = requireAuth(request);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID not found' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');

    // If session_id provided, return messages for that session
    if (sessionId) {
      const messages = await prisma.chat_history.findMany({
        where: {
          user_id: user.userId,
          session_id: sessionId,
        },
        orderBy: { created_at: 'asc' },
        select: {
          id: true,
          role: true,
          content: true,
          report_id: true,
          prescription_id: true,
          sources: true,
          context_mode: true,
          created_at: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          sessionId,
          messages: messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            reportId: msg.report_id,
            prescriptionId: msg.prescription_id,
            sources: msg.sources ? JSON.parse(msg.sources) : [],
            contextMode: msg.context_mode,
            createdAt: msg.created_at,
          })),
        },
        { status: 200 }
      );
    }

    // Otherwise, return list of sessions
    const rawSessions = await prisma.chat_history.findMany({
      where: { user_id: user.userId },
      orderBy: { created_at: 'asc' },
      select: {
        session_id: true,
        role: true,
        content: true,
        report_id: true,
        prescription_id: true,
        context_mode: true,
        created_at: true,
      },
    });

    // Group by session_id
    const sessionMap = new Map();
    for (const row of rawSessions) {
      if (!sessionMap.has(row.session_id)) {
        sessionMap.set(row.session_id, {
          sessionId: row.session_id,
          firstMessage: null,
          lastMessageAt: row.created_at,
          messageCount: 0,
          reportId: row.report_id,
          prescriptionId: row.prescription_id,
          contextMode: row.context_mode,
        });
      }

      const session = sessionMap.get(row.session_id);
      session.messageCount += 1;
      session.lastMessageAt = row.created_at;

      // Capture first user message as preview
      if (!session.firstMessage && row.role === 'user' && row.content) {
        session.firstMessage = row.content.length > 80
          ? row.content.substring(0, 80) + '...'
          : row.content;
      }

      // Capture document context from any message in the session
      if (row.report_id) session.reportId = row.report_id;
      if (row.prescription_id) session.prescriptionId = row.prescription_id;
    }

    const sessions = Array.from(sessionMap.values())
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      .slice(0, 30);

    return NextResponse.json(
      {
        success: true,
        sessions,
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
