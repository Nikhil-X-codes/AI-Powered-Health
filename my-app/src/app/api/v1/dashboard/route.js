import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

function parseMetricValue(value) {
  if (!value) {
    return null;
  }

  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  if (!match) {
    return null;
  }

  return Number(match[0]);
}

function formatDateKey(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function buildNormalizedSeries(series) {
  const values = series.map((entry) => entry.value).filter((value) => value !== null);
  if (values.length === 0) {
    return series.map((entry) => ({
      ...entry,
      normalized: null,
    }));
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return series.map((entry) => ({
    ...entry,
    normalized: entry.value === null ? null : (entry.value - min) / range,
  }));
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
      totalReports,
      analyzedReports,
      pendingReports,
      totalPrescriptions,
      medicinesExplained,
      totalMetricsTracked,
      recentReports,
      recentPrescriptions,
      metricStatuses,
      recentMetrics,
      pendingPrescriptionCount,
    ] = await Promise.all([
      prisma.reports.count({
        where: { user_id: userId },
      }),
      prisma.reports.count({
        where: {
          user_id: userId,
          summary: { not: null },
        },
      }),
      prisma.reports.count({
        where: {
          user_id: userId,
          summary: null,
        },
      }),
      prisma.prescriptions.count({
        where: { user_id: userId },
      }),
      prisma.medicines.count({
        where: {
          prescription: {
            user_id: userId,
          },
        },
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
      prisma.health_metrics.groupBy({
        by: ['status'],
        where: {
          report: {
            user_id: userId,
          },
        },
        _count: {
          status: true,
        },
      }),
      prisma.health_metrics.findMany({
        where: {
          report: {
            user_id: userId,
          },
          OR: [
            {
              metric_name: {
                contains: 'hemoglobin',
                mode: 'insensitive',
              },
            },
            {
              metric_name: {
                contains: 'glucose',
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: { created_at: 'asc' },
        select: {
          metric_name: true,
          metric_value: true,
          status: true,
          created_at: true,
        },
      }),
      prisma.prescriptions.count({
        where: {
          user_id: userId,
          medicines: {
            none: {},
          },
        },
      }),
    ]);

    const statusDistribution = metricStatuses
      .filter((entry) => entry.status)
      .map((entry) => ({
        status: entry.status,
        count: entry._count.status,
      }));

    const hemoglobinSeries = [];
    const glucoseSeries = [];
    const combinedMap = new Map();

    for (const metric of recentMetrics) {
      const normalizedName = String(metric.metric_name || '').toLowerCase();
      const dateKey = formatDateKey(metric.created_at);
      const value = parseMetricValue(metric.metric_value);

      if (!dateKey || value === null) {
        continue;
      }

      if (normalizedName.includes('hemoglobin')) {
        hemoglobinSeries.push({ date: dateKey, value });
        const entry = combinedMap.get(dateKey) || { date: dateKey };
        entry.hemoglobin = value;
        combinedMap.set(dateKey, entry);
      }

      if (normalizedName.includes('glucose')) {
        glucoseSeries.push({ date: dateKey, value });
        const entry = combinedMap.get(dateKey) || { date: dateKey };
        entry.glucose = value;
        combinedMap.set(dateKey, entry);
      }
    }

    const combinedSeries = Array.from(combinedMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const normalizedCombined = (() => {
      const hemoglobinNormalized = buildNormalizedSeries(
        combinedSeries.map((entry) => ({
          date: entry.date,
          value: entry.hemoglobin ?? null,
        }))
      );
      const glucoseNormalized = buildNormalizedSeries(
        combinedSeries.map((entry) => ({
          date: entry.date,
          value: entry.glucose ?? null,
        }))
      );

      return combinedSeries.map((entry) => {
        const hemo = hemoglobinNormalized.find((item) => item.date === entry.date);
        const glu = glucoseNormalized.find((item) => item.date === entry.date);

        return {
          date: entry.date,
          hemoglobin: hemo?.normalized ?? null,
          glucose: glu?.normalized ?? null,
        };
      });
    })();

    const latestHemoglobin = [...recentMetrics]
      .filter((metric) =>
        String(metric.metric_name || '').toLowerCase().includes('hemoglobin')
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    const latestGlucose = [...recentMetrics]
      .filter((metric) =>
        String(metric.metric_name || '').toLowerCase().includes('glucose')
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    const alerts = [];

    if (latestHemoglobin?.status?.toLowerCase() === 'low') {
      alerts.push({
        title: 'Low hemoglobin detected',
        message: 'Recent hemoglobin value is below the normal range.',
        tone: 'warning',
      });
    }

    if (latestGlucose?.status?.toLowerCase() === 'high') {
      alerts.push({
        title: 'High glucose detected',
        message: 'Recent glucose value is above the normal range.',
        tone: 'alert',
      });
    }

    if (pendingPrescriptionCount > 0) {
      alerts.push({
        title: 'Prescriptions pending explanation',
        message: `${pendingPrescriptionCount} prescription${
          pendingPrescriptionCount === 1 ? '' : 's'
        } still need explanation.`,
        tone: 'info',
      });
    }

    return NextResponse.json(
      {
        stats: {
          totalReports,
          analyzedReports,
          pendingReports,
          totalPrescriptions,
          medicinesExplained,
          totalMetricsTracked,
        },
        trends: {
          hemoglobin: hemoglobinSeries,
          glucose: glucoseSeries,
          statusDistribution,
          combined: normalizedCombined,
        },
        recentReports: recentReports.map((report) => ({
          id: report.id,
          report_name: report.report_name,
          created_at: report.created_at,
          summary: report.summary,
          metricCount: report._count.health_metrics,
        })),
        recentPrescriptions: recentPrescriptions.map((prescription) => ({
          id: prescription.id,
          file_url: prescription.file_url,
          created_at: prescription.created_at,
          medicineCount: prescription._count.medicines,
        })),
        alerts,
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
