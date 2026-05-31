import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

function derivePrescriptionDisplayName(fileUrl, createdAt) {
  if (fileUrl) {
    try {
      const parsed = new URL(fileUrl);
      const rawName = parsed.pathname.split('/').pop() || '';
      const withoutExt = rawName.replace(/\.[^/.]+$/, '');
      const decoded = decodeURIComponent(withoutExt).replace(/[+_\-]+/g, ' ').trim();

      if (decoded) {
        return decoded;
      }
    } catch {
      // Fallback handled below.
    }
  }

  const date = createdAt ? new Date(createdAt) : null;
  if (date && !Number.isNaN(date.getTime())) {
    return `Prescription ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }

  return 'Prescription';
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
        prescriptions: prescriptions.map((prescription) => ({
          ...prescription,
          display_name: derivePrescriptionDisplayName(prescription.file_url, prescription.created_at),
        })),
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
