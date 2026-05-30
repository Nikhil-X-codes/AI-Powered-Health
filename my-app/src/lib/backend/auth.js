import { verifyToken } from '@/lib/jwt';

function readCookieValue(request, name) {
  const cookieHeader = request.headers?.get('cookie') || request.headers?.get('Cookie') || '';

  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(';')) {
    const [rawKey, ...rawValueParts] = part.trim().split('=');
    if (rawKey !== name) {
      continue;
    }

    return decodeURIComponent(rawValueParts.join('='));
  }

  return null;
}

export function getRequestToken(request) {
  const authorization = request.headers?.get('authorization') || request.headers?.get('Authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.slice(7);
  }

  const cookieToken = request.cookies?.get?.('token')?.value || readCookieValue(request, 'token');
  return cookieToken || null;
}

export function getAuthenticatedUser(request) {
  const token = getRequestToken(request);

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);

  if (!decoded?.userId || !decoded?.email) {
    return null;
  }

  return {
    userId: String(decoded.userId),
    email: String(decoded.email),
  };
}

export function requireAuthenticatedUser(request) {
  const user = getAuthenticatedUser(request);

  if (!user) {
    return {
      isValid: false,
      user: null,
    };
  }

  return {
    isValid: true,
    user,
  };
}