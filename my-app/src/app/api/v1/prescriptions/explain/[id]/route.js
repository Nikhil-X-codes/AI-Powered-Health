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

console.log("🚀 COMPILING: prescription explain route.js is being loaded by Next.js");

export async function POST(request, { params }) {
  try {
    const { id: prescriptionId } = await params;
    
    const { isValid, user } = requireAuth(request);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized - User ID not found' }, { status: 401 });
    }
    const userId = user.userId;

    const prescription = await prisma.prescriptions.findUnique({ where: { id: prescriptionId } });
    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    let requestBody = {};
    try { requestBody = await request.json(); } catch { requestBody = {}; }

    const clientReviewedText = String(requestBody.ocr_text || '').trim();
    const fastApiBaseUrl = getFastApiBaseUrl();
    let extractedText = clientReviewedText;

    if (!extractedText) {
      const ocrResponse = await fetchWithTimeout(`${fastApiBaseUrl}/ocr/from-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_url: prescription.file_url, description: 'Prescription image' }),
      });
      if (!ocrResponse.ok) throw new Error('Failed to extract text');
      extractedText = (await ocrResponse.json()).text;
    }

    const explanationResponse = await fetchWithTimeout(`${fastApiBaseUrl}/prescriptions/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...requestBody, ocr_text: extractedText, prescription_id: prescriptionId }),
    });

    if (!explanationResponse.ok) {
      return NextResponse.json({ error: 'Failed to analyze prescription' }, { status: 500 });
    }

    const explanationData = await explanationResponse.json();
    const { medicines, pharmacy_notes } = explanationData;

    await prisma.medicines.deleteMany({ where: { prescription_id: prescriptionId } });

    const savedMedicines = [];
    if (medicines && medicines.length > 0) {
      const uniqueMedicinesMap = new Map();
      for (const med of medicines) {
        if (!med || typeof med !== 'object') continue;
        const name = String(med.name || '').trim();
        if (!name) continue;
        const lowerName = name.toLowerCase();
        if (!uniqueMedicinesMap.has(lowerName)) uniqueMedicinesMap.set(lowerName, med);
      }
      const deduplicatedMedicines = Array.from(uniqueMedicinesMap.values());
      if (deduplicatedMedicines.length > 0) {
        await prisma.medicines.createMany({
          data: deduplicatedMedicines.map((med) => ({
            prescription_id: prescriptionId,
            medicine_name: String(med.name || '').trim().substring(0, 255),
            usage_info: med.usage_instructions,
            dosage_info: med.dosage,
            side_effects: med.side_effects,
          })),
        });
        const stored = await prisma.medicines.findMany({ where: { prescription_id: prescriptionId } });
        savedMedicines.push(...stored);
      }
    }

    const updatedPrescription = await prisma.prescriptions.update({
      where: { id: prescriptionId },
      data: { extracted_text: extractedText },
      include: { medicines: { select: { id: true, medicine_name: true, usage_info: true, dosage_info: true, side_effects: true } } },
    });

    try {
      const medicinesText = updatedPrescription.medicines.map((med) => `${med.medicine_name || 'Medicine'}: ${med.dosage_info || ''}. ${med.usage_info || ''}. ${med.side_effects || ''}`).join('\n');
      const prescriptionTextToEmbed = ['Prescription:', 'Vision API Extracted Text:', extractedText, medicinesText ? `Medicines:\n${medicinesText}` : null].filter(Boolean).join('\n\n');

      fetchWithTimeout(`${fastApiBaseUrl}/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: [prescriptionTextToEmbed], source: 'prescription', user_id: userId, prescription_id: prescriptionId }),
      }, 60_000).catch(() => {});
    } catch (embedError) {}

    return NextResponse.json({
      success: true,
      prescriptionId: updatedPrescription.id,
      extractedText: updatedPrescription.extracted_text,
      pharmacyNotes: pharmacy_notes,
      medicines: updatedPrescription.medicines.map((med) => ({ id: med.id, name: med.medicine_name, usageInstructions: med.usage_info, dosage: med.dosage_info, sideEffects: med.side_effects })),
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: `Failed to explain prescription: ${error.message}` }, { status: 500 });
  }
}
