export function getAuthUser(request) {
  const userId = request.headers.get('x-user-id');
  const email = request.headers.get('x-user-email');

  if (userId && email) {
    return {
      userId,
      email,
    };
  }

  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return null;
  }

  // API routes run in the Node runtime, so jsonwebtoken is safe here.
  const { verifyToken } = require('./jwt');
  const decoded = verifyToken(token);

  if (!decoded?.userId || !decoded?.email) {
    return null;
  }

  return {
    userId: String(decoded.userId),
    email: String(decoded.email),
  };
}

export function requireAuth(request) {
  const user = getAuthUser(request);

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
