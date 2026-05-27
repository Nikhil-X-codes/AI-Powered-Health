import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const jwtKey = new TextEncoder().encode(JWT_SECRET);

const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, jwtKey);
    return payload;
  } catch (error) {
    return null;
  }
};

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Skip API routes; do not run middleware on backend APIs.
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip public pages
  const publicPages = ['/auth/login', '/auth/signup', '/'];
  if (publicPages.includes(pathname)) {
    return NextResponse.next();
  }

  // Only protect dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Protect dashboard pages
  const token = request.cookies.get('token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');

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
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};