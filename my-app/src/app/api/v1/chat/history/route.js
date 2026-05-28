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
