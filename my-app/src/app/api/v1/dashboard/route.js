import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

function parseMetricValue(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function formatDateKey(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function slugifyMetricName(metricName) {
  return String(metricName || 'metric')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'metric';
}

function humanizeMetricName(metricName) {
  return String(metricName || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'Metric';
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

    const [
      reportsCount,
      prescriptionsCount,
      healthMetricsCount,
      recentReports,
      recentPrescriptions,
      healthMetrics,
      healthAlerts,
    ] = await Promise.all([
      prisma.reports.count({
        where: { user_id: userId },
      }),
      prisma.prescriptions.count({
        where: { user_id: userId },
      }),
      prisma.health_metrics.count({
        where: {
          report: {
            user_id: userId,
          },
        },
      }),
      prisma.reports.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 5,
        include: {
          _count: {
            select: { health_metrics: true },
          },
        },
      }),
      prisma.prescriptions.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 5,
        include: {
          _count: {
            select: { medicines: true },
          },
        },
      }),
      prisma.health_metrics.findMany({
        where: {
          report: {
            user_id: userId,
          },
        },
        orderBy: { created_at: 'asc' },
        select: {
          metric_name: true,
          metric_value: true,
          status: true,
          created_at: true,
          report_id: true,
          report: {
            select: {
              report_name: true,
            },
          },
        },
      }),
      prisma.health_metrics.findMany({
        where: {
          report: {
            user_id: userId,
          },
          status: {
            in: ['High', 'Low'],
          },
        },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: {
          metric_name: true,
          metric_value: true,
          status: true,
          created_at: true,
          report_id: true,
          report: {
            select: {
              report_name: true,
            },
          },
        },
      }),
    ]);

    const groupedMetricsMap = new Map();
    const chartRows = new Map();

    for (const metric of healthMetrics) {
      const metricName = metric.metric_name?.trim();
      const numericValue = parseMetricValue(metric.metric_value);
      const dateKey = formatDateKey(metric.created_at);

      if (!metricName || numericValue === null || !dateKey) {
        continue;
      }

      const slug = slugifyMetricName(metricName);
      const point = {
        date: dateKey,
        value: numericValue,
        status: metric.status,
        created_at: metric.created_at,
        report_id: metric.report_id,
        report_name: metric.report?.report_name || null,
      };

      const group = groupedMetricsMap.get(metricName) || {
        metricName,
        key: slug,
        points: [],
      };

      group.points.push(point);
      groupedMetricsMap.set(metricName, group);

      const row = chartRows.get(dateKey) || { date: dateKey };
      row[slug] = numericValue;
      chartRows.set(dateKey, row);
    }

    const groupedMetrics = Array.from(groupedMetricsMap.values())
      .map((group) => ({
        ...group,
        points: group.points.sort((left, right) => new Date(left.created_at) - new Date(right.created_at)),
        latestPoint: group.points[group.points.length - 1] || null,
      }))
      .sort((left, right) => {
        const countDelta = right.points.length - left.points.length;
        if (countDelta !== 0) {
          return countDelta;
        }

        const leftTime = left.latestPoint ? new Date(left.latestPoint.created_at).getTime() : 0;
        const rightTime = right.latestPoint ? new Date(right.latestPoint.created_at).getTime() : 0;
        return rightTime - leftTime;
      });

    const selectedGroups = groupedMetrics.slice(0, 4);
    const selectedKeys = selectedGroups.map((group) => group.key);

    const chartData = Array.from(chartRows.values())
      .sort((left, right) => left.date.localeCompare(right.date))
      .map((row) => {
        const selectedRow = { date: row.date };
        for (const key of selectedKeys) {
          selectedRow[key] = row[key] ?? null;
        }
        return selectedRow;
      });

    const chartMetricLabels = selectedGroups.map((group) => ({
      key: group.key,
      label: humanizeMetricName(group.metricName),
    }));

    const recentReportSummaries = recentReports.map((report) => ({
      id: report.id,
      reportName: report.report_name,
      createdAt: report.created_at,
      summary: report.summary,
      metricCount: report._count.health_metrics,
      analysisStatus: report.summary ? 'Analyzed' : 'Pending',
    }));

    const recentPrescriptionSummaries = recentPrescriptions.map((prescription) => ({
      id: prescription.id,
      fileUrl: prescription.file_url,
      createdAt: prescription.created_at,
      medicineCount: prescription._count.medicines,
      explanationStatus: prescription._count.medicines > 0 ? 'Explained' : 'Pending',
    }));

    const healthAlertsData = healthAlerts.map((metric) => ({
      id: `${metric.report_id}-${metric.metric_name}-${metric.created_at}`,
      metricName: metric.metric_name,
      metricValue: metric.metric_value,
      status: metric.status,
      createdAt: metric.created_at,
      reportId: metric.report_id,
      reportName: metric.report?.report_name || 'Medical report',
      tone: String(metric.status || '').toLowerCase() === 'low' ? 'warning' : 'alert',
      title: `${metric.status} ${metric.metric_name || 'metric'}`,
      message: `${metric.metric_name || 'This metric'} was recorded as ${metric.metric_value || 'unknown value'} in ${metric.report?.report_name || 'a report'}.`,
    }));

    return NextResponse.json(
      {
        stats: {
          reportsCount,
          prescriptionsCount,
          healthMetricsCount,
        },
        trends: {
          groupedMetrics: selectedGroups,
          chartData,
          chartMetricLabels,
          totalMetricGroups: groupedMetrics.length,
        },
        recentReports: recentReportSummaries,
        recentPrescriptions: recentPrescriptionSummaries,
        healthAlerts: healthAlertsData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
