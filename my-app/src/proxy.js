import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const jwtKey = new TextEncoder().encode(JWT_SECRET);

function unauthorizedApiResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, jwtKey);
    return payload;
  } catch (error) {
    return null;
  }
};

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value ||
    request.headers.get('Authorization')?.replace('Bearer ', '');

  const isAuthRoute = pathname.startsWith('/api/v1/auth/');
  const isHealthRoute = pathname.startsWith('/api/v1/health/');
  // Allow auth and health API routes to be called without an auth token
  if (pathname.startsWith('/api/v1/') && (isAuthRoute || isHealthRoute)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/v1/') && !isAuthRoute && !isHealthRoute) {
    if (!token) {
      return unauthorizedApiResponse();
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return unauthorizedApiResponse();
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', String(decoded.userId ?? ''));
    requestHeaders.set('x-user-email', String(decoded.email ?? ''));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', String(decoded.userId ?? ''));
  requestHeaders.set('x-user-email', String(decoded.email ?? ''));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/voice/:path*', '/api/v1/:path*'],
};