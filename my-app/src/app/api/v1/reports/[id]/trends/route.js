import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

function parseMetricValue(value) {
  if (!value) return null;
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export async function GET(request, { params }) {
  try {
    const { id: reportId } = await params;
    const { isValid, user } = requireAuth(request);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.userId;

    // Get metric names from the current report
    const currentMetrics = await prisma.health_metrics.findMany({
      where: { report_id: reportId },
      select: { metric_name: true },
    });

    const metricNames = [...new Set(
      currentMetrics
        .map((m) => m.metric_name?.trim())
        .filter(Boolean)
    )];

    if (metricNames.length === 0) {
      return NextResponse.json({
        success: true,
        trends: [],
      });
    }

    // Get historical data for these metric names across all user reports
    const historicalMetrics = await prisma.health_metrics.findMany({
      where: {
        report: { user_id: userId },
        metric_name: { in: metricNames },
      },
      orderBy: { created_at: 'asc' },
      select: {
        metric_name: true,
        metric_value: true,
        status: true,
        created_at: true,
        report_id: true,
        report: {
          select: { report_name: true },
        },
      },
    });

    // Group by metric_name
    const trendMap = new Map();
    for (const metric of historicalMetrics) {
      const name = metric.metric_name?.trim();
      const numericValue = parseMetricValue(metric.metric_value);
      if (!name || numericValue === null) continue;

      if (!trendMap.has(name)) {
        trendMap.set(name, {
          metricName: name,
          points: [],
        });
      }

      trendMap.get(name).points.push({
        value: numericValue,
        rawValue: metric.metric_value,
        status: metric.status,
        date: metric.created_at,
        reportId: metric.report_id,
        reportName: metric.report?.report_name || null,
        isCurrent: metric.report_id === reportId,
      });
    }

    // Only return trends with 2+ data points (otherwise no line to draw)
    const trends = Array.from(trendMap.values())
      .filter((t) => t.points.length >= 2)
      .map((t) => ({
        ...t,
        points: t.points.sort((a, b) => new Date(a.date) - new Date(b.date)),
      }));

    return NextResponse.json({
      success: true,
      trends,
    });
  } catch (error) {
    console.error('Trends error:', error);
    return NextResponse.json(
      { error: 'Failed to load trends' },
      { status: 500 }
    );
  }
}
