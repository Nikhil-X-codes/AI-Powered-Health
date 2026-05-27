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
    const userId = user.userId;

    // Get all reports for user
    const reports = await prisma.reports.findMany({
      where: {
        user_id: userId,
      },
      include: {
        health_metrics: {
          select: {
            id: true,
            metric_name: true,
            metric_value: true,
            status: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        reports,
        total: reports.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
