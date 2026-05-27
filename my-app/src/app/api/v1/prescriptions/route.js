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

    // Get all prescriptions for user
    const prescriptions = await prisma.prescriptions.findMany({
      where: {
        user_id: userId,
      },
      include: {
        medicines: {
          select: {
            id: true,
            medicine_name: true,
            dosage_info: true,
            usage_info: true,
            side_effects: true,
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
        prescriptions,
        total: prescriptions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
}
