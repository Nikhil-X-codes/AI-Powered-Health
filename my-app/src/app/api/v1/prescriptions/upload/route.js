import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { parseFormData, validateFileType, validateFileSize } from '@/lib/form-parser';
import { requireAuth } from '@/lib/api-auth';

export async function POST(request) {
  try {
    const { isValid, user } = requireAuth(request);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID not found' },
        { status: 401 }
      );
    }
    const userId = user.userId;

    // Parse form data
    const { file, fields } = await parseFormData(request, ['prescription', 'file']);

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(file.mimetype)) {
      return NextResponse.json(
        { error: 'Invalid file type. Accepted: PDF, JPEG, PNG, JPG' },
        { status: 400 }
      );
    }

    // Validate file size
    if (!validateFileSize(file.buffer.length)) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';

    // Upload to Cloudinary
    const { secure_url, public_id } = await uploadToCloudinary(
      file.buffer,
      file.originalname,
      'health-app/prescriptions',
      resourceType
    );

    // Save metadata to database
    const prescription = await prisma.prescriptions.create({
      data: {
        user_id: userId,
        file_url: secure_url,
      },
    });

    return NextResponse.json(
      {
        success: true,
        prescriptionId: prescription.id,
        fileUrl: secure_url,
        message: 'Prescription uploaded successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Prescription upload error:', error);

    if (error.message.includes('File type') || error.message.includes('file')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to upload prescription' },
      { status: 500 }
    );
  }
}
