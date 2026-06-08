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

import fs from 'fs';

export async function POST(request, { params }) {
  try {
    const { id: reportId } = await params;
    
    const { isValid, user } = requireAuth(request);
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.userId;

    // Verify report exists
    const report = await prisma.reports.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
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

    if (!extractedText) {
      const ocrResponse = await fetchWithTimeout(`${fastApiBaseUrl}/ocr/from-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_url: report.file_url, description: report.report_name }),
      });
      if (!ocrResponse.ok) throw new Error('Failed to extract text from report');
      extractedText = (await ocrResponse.json()).text;
    }

    const analysisResponse = await fetchWithTimeout(`${fastApiBaseUrl}/analyze/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...requestBody, ocr_text: extractedText, report_id: reportId }),
    });

    if (!analysisResponse.ok) {
      return NextResponse.json({ error: 'Failed to analyze report metrics' }, { status: 500 });
    }

    const analysisData = await analysisResponse.json();
    
    const { metrics, overall_summary } = analysisData;

    if (metrics && metrics.length > 0) {
      const metricsData = metrics.map((metric) => ({
        report_id: reportId,
        metric_name: metric.metric_name,
        metric_value: metric.metric_value,
        status: metric.status,
        explanation: metric.explanation,
      }));
      await prisma.health_metrics.createMany({ data: metricsData });
    }

    const updatedReport = await prisma.reports.update({
      where: { id: reportId },
      data: { summary: overall_summary },
      include: { health_metrics: { select: { id: true, metric_name: true, metric_value: true, status: true, explanation: true, created_at: true } } },
    });

    try {
      const metricsText = updatedReport.health_metrics.map(m => `${m.metric_name}: ${m.metric_value} (${m.status}). ${m.explanation}`).join('\n');
      const reportTextToEmbed = [`Report: ${report.report_name || 'Medical Report'}`, 'Vision API Extracted Text:', extractedText, updatedReport.summary ? `Summary: ${updatedReport.summary}` : null, metricsText ? `Metrics:\n${metricsText}` : null].filter(Boolean).join('\n\n');

      fetchWithTimeout(`${fastApiBaseUrl}/embed/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: [{ text: reportTextToEmbed, metadata: { source: 'report', user_id: userId, report_id: reportId }, id: reportId }], source: 'report', user_id: userId, report_id: reportId }),
      }, 60_000).catch(() => {});
    } catch (embedError) {}

    return NextResponse.json({
      success: true,
      reportId: updatedReport.id,
      summary: updatedReport.summary,
      metrics: updatedReport.health_metrics,
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: `Failed to analyze report: ${error.message}` }, { status: 500 });
  }
}

