import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

const FASTAPI_BASE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

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
    const { id: reportId } = params;
    const { isValid, user } = requireAuth(request);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID not found' },
        { status: 401 }
      );
    }
    const userId = user.userId;

    // Verify report exists and belongs to user
    const report = await prisma.reports.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    if (report.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Report belongs to another user' },
        { status: 403 }
      );
    }

    console.log(`Analyzing report ${reportId} from ${report.file_url}`);

    // Step 1: Call FastAPI to extract text from Cloudinary URL
    const ocrResponse = await fetchWithTimeout(
      `${FASTAPI_BASE_URL}/ocr/from-url`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_url: report.file_url,
          description: report.report_name,
        }),
      },
    );

    if (!ocrResponse.ok) {
      const errorText = await ocrResponse.text();
      console.error('FastAPI OCR error:', errorText);
      return NextResponse.json(
        { error: 'Failed to extract text from report' },
        { status: 500 }
      );
    }

    const ocrData = await ocrResponse.json();
    const extractedText = ocrData.text;

    console.log(`Extracted ${extractedText.length} characters from report`);

    // Step 2: Call FastAPI to analyze metrics from OCR text
    const analysisResponse = await fetchWithTimeout(
      `${FASTAPI_BASE_URL}/analyze/report`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ocr_text: extractedText,
          report_id: reportId,
        }),
      },
    );

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('FastAPI analysis error:', errorText);
      return NextResponse.json(
        { error: 'Failed to analyze report metrics' },
        { status: 500 }
      );
    }

    const analysisData = await analysisResponse.json();
    const { metrics, overall_summary } = analysisData;

    console.log(`Extracted ${metrics.length} metrics from analysis`);

    // Step 3: Bulk insert health metrics into database
    if (metrics && metrics.length > 0) {
      const metricsData = metrics.map((metric) => ({
        report_id: reportId,
        metric_name: metric.metric_name,
        metric_value: metric.metric_value,
        status: metric.status,
        explanation: metric.explanation,
      }));

      await prisma.health_metrics.createMany({
        data: metricsData,
      });

      console.log(`Inserted ${metricsData.length} metrics into database`);
    }

    // Step 4: Update report summary and fetch final data
    const updatedReport = await prisma.reports.update({
      where: { id: reportId },
      data: {
        summary: overall_summary,
      },
      include: {
        health_metrics: {
          select: {
            id: true,
            metric_name: true,
            metric_value: true,
            status: true,
            explanation: true,
            created_at: true,
          },
        },
      },
    });

    try {
      const metricsText = updatedReport.health_metrics
        .map(
          (metric) =>
            `${metric.metric_name}: ${metric.metric_value} (${metric.status}). ${metric.explanation}`
        )
        .join('\n');

      const reportTextToEmbed = [
        `Report: ${report.report_name || 'Medical Report'}`,
        'OCR Text:',
        extractedText,
        updatedReport.summary ? `Summary: ${updatedReport.summary}` : null,
        metricsText ? `Metrics:\n${metricsText}` : null,
      ]
        .filter(Boolean)
        .join('\n\n');

      await fetchWithTimeout(
        `${FASTAPI_BASE_URL}/embed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texts: [reportTextToEmbed],
            source: 'report',
            user_id: userId,
            report_id: reportId,
          }),
        },
        60_000
      );
    } catch (embedError) {
      console.warn('RAG embed failed for report:', embedError.message);
    }

    return NextResponse.json(
      {
        success: true,
        reportId: updatedReport.id,
        summary: updatedReport.summary,
        metrics: updatedReport.health_metrics,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Report analysis error:', error);
    return NextResponse.json(
      { error: `Failed to analyze report: ${error.message}` },
      { status: 500 }
    );
  }
}

