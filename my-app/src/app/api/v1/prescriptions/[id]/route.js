import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { getFastApiBaseUrl } from '@/lib/fastapi';

function getPublicIdFromUrl(fileUrl) {
  if (!fileUrl) return null;
  try {
    const uploadIndex = fileUrl.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    
    const afterUpload = fileUrl.substring(uploadIndex + 8);
    const parts = afterUpload.split('/');
    let startIndex = 0;
    if (parts[0].startsWith('v') && /^\d+$/.test(parts[0].substring(1))) {
      startIndex = 1;
    }
    
    const remaining = parts.slice(startIndex).join('/');
    
    if (fileUrl.toLowerCase().endsWith('.pdf')) {
      return decodeURIComponent(remaining);
    } else {
      return decodeURIComponent(remaining.replace(/\.[^/.]+$/, ''));
    }
  } catch (e) {
    console.error('Failed to parse public ID:', e);
    return null;
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { isValid, user } = requireAuth(request);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID not found' },
        { status: 401 }
      );
    }
    const userId = user.userId;

    // Fetch prescription to verify ownership
    const prescription = await prisma.prescriptions.findUnique({
      where: { id },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    if (prescription.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Prescription belongs to another user' },
        { status: 403 }
      );
    }

    // 1. Delete from Cloudinary
    if (prescription.file_url) {
      try {
        const publicId = getPublicIdFromUrl(prescription.file_url);
        const resourceType = prescription.file_url.toLowerCase().endsWith('.pdf') ? 'raw' : 'image';
        if (publicId) {
          await deleteFromCloudinary(publicId, resourceType);
        }
      } catch (cloudinaryError) {
        console.warn('Failed to delete prescription from Cloudinary:', cloudinaryError.message);
      }
    }

    // 2. Delete embeddings from FastAPI ChromaDB
    try {
      const fastApiBaseUrl = getFastApiBaseUrl();
      const response = await fetch(`${fastApiBaseUrl}/embed/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          document_id: id,
        }),
      });
      if (!response.ok) {
        const errText = await response.text();
        console.warn('[DELETE] FastAPI embedding deletion returned non-OK status:', response.status, errText);
      }
    } catch (fastApiError) {
      console.warn('Failed to delete prescription embeddings from FastAPI:', fastApiError.message);
    }

    // 3. Delete from DB (foreign keys will cascade and delete associated medicines)
    await prisma.prescriptions.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Prescription and all associated data deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Prescription deletion error:', error);
    return NextResponse.json(
      { error: `Failed to delete prescription: ${error.message}` },
      { status: 500 }
    );
  }
}
