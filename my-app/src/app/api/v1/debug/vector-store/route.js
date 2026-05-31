import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getFastApiBaseUrl } from '@/lib/fastapi';

export async function GET(request) {
  try {
    const { isValid, user } = requireAuth(request);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized - User ID not found' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('report_id');
    const query = searchParams.get('query') || 'test';

    const url = new URL(`${getFastApiBaseUrl()}/debug/retrieval`);
    url.searchParams.set('user_id', user.userId);
    if (reportId) url.searchParams.set('report_id', reportId);
    url.searchParams.set('query', query);

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type') || 'application/json';
    if (!contentType.includes('application/json')) {
      return new NextResponse(await response.text(), {
        status: response.status,
        headers: { 'Content-Type': contentType },
      });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Failed to inspect vector store' },
      { status: 500 }
    );
  }
}