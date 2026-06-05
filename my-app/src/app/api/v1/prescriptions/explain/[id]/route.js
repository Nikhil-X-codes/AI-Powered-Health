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

export async function POST(request, { params }) {
  try {
    const { id: prescriptionId } = await params;
    const { isValid, user } = requireAuth(request);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID not found' },
        { status: 401 }
      );
    }
    const userId = user.userId;

    // Verify prescription exists and belongs to user
    const prescription = await prisma.prescriptions.findUnique({
      where: { id: prescriptionId },
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

    let requestBody = {};
    try {
      requestBody = await request.json();
    } catch {
      requestBody = {};
    }

    const clientReviewedText = String(requestBody.ocr_text || '').trim();


    const fastApiBaseUrl = getFastApiBaseUrl();

    let extractedText = clientReviewedText;

    // Step 1: Call FastAPI to extract text from Cloudinary URL when the client did not provide reviewed OCR text
    if (!extractedText) {
      const ocrResponse = await fetchWithTimeout(
        `${fastApiBaseUrl}/ocr/from-url`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file_url: prescription.file_url,
            description: 'Prescription image',
          }),
        },
      );

      if (!ocrResponse.ok) {
        const errorText = await ocrResponse.text();
        return NextResponse.json(
          { error: 'Failed to extract text from prescription' },
          { status: 500 }
        );
      }

      const ocrData = await ocrResponse.json();
      extractedText = ocrData.text;
    }



    // Step 2: Call FastAPI to explain prescription medicines
    const explanationResponse = await fetchWithTimeout(
      `${fastApiBaseUrl}/prescriptions/explain`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ocr_text: extractedText,
          prescription_id: prescriptionId,
        }),
      },
    );

    if (!explanationResponse.ok) {
      const errorText = await explanationResponse.text();
      return NextResponse.json(
        { error: 'Failed to analyze prescription' },
        { status: 500 }
      );
    }

    const explanationData = await explanationResponse.json();
    const { medicines, pharmacy_notes } = explanationData;



    // Step 3: Delete old medicines (to avoid duplicates) and insert new ones
    await prisma.medicines.deleteMany({
      where: { prescription_id: prescriptionId },
    });

    const savedMedicines = [];
    if (medicines && medicines.length > 0) {
      const medicinesData = medicines.map((med) => ({
        prescription_id: prescriptionId,
        medicine_name: med.name,
        usage_info: med.usage_instructions,
        dosage_info: med.dosage,
        side_effects: med.side_effects,
      }));

      const createdMedicines = await prisma.medicines.createMany({
        data: medicinesData,
      });

      // Fetch the created medicines to return full data
      const stored = await prisma.medicines.findMany({
        where: { prescription_id: prescriptionId },
      });
      savedMedicines.push(...stored);
    }

    // Step 4: Update prescription with extracted text
    const updatedPrescription = await prisma.prescriptions.update({
      where: { id: prescriptionId },
      data: { extracted_text: extractedText },
      include: {
        medicines: {
          select: {
            id: true,
            medicine_name: true,
            usage_info: true,
            dosage_info: true,
            side_effects: true,
          },
        },
      },
    });

    try {
      const medicinesText = updatedPrescription.medicines
        .map(
          (med) =>
            `${med.medicine_name || 'Medicine'}: ${med.dosage_info || ''}. ${med.usage_info || ''}. ${med.side_effects || ''}`
        )
        .join('\n');

      const prescriptionTextToEmbed = [
        'Prescription:',
        'OCR Text:',
        extractedText,
        medicinesText ? `Medicines:\n${medicinesText}` : null,
      ]
        .filter(Boolean)
        .join('\n\n');

      const embedResponse = await fetchWithTimeout(
        `${fastApiBaseUrl}/embed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texts: [prescriptionTextToEmbed],
            source: 'prescription',
            user_id: userId,
            prescription_id: prescriptionId,
          }),
        },
        60_000
      );

      if (!embedResponse.ok) {
        const embedErrorText = await embedResponse.text();
        console.error('[Explain] RAG embed failed:', embedErrorText);
      } else {
        const embedData = await embedResponse.json();
        console.log(
          `[Explain] RAG indexed ${embedData.chunks} chunk(s), ${prescriptionTextToEmbed.length} chars for ${prescriptionId}`
        );
      }
    } catch (embedError) {
      console.warn('RAG embed failed for prescription:', embedError.message);
    }

    return NextResponse.json(
      {
        success: true,
        prescriptionId: updatedPrescription.id,
        extractedText: updatedPrescription.extracted_text,
        pharmacyNotes: pharmacy_notes,
        medicines: updatedPrescription.medicines.map((med) => ({
          id: med.id,
          name: med.medicine_name,
          usageInstructions: med.usage_info,
          dosage: med.dosage_info,
          sideEffects: med.side_effects,
        })),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Prescription explanation error:', error);
    return NextResponse.json(
      { error: `Failed to explain prescription: ${error.message}` },
      { status: 500 }
    );
  }
}
