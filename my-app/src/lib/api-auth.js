import { getAuthenticatedUser, requireAuthenticatedUser } from '@/lib/backend/auth';

export function getAuthUser(request) {
  return getAuthenticatedUser(request);
}

export function requireAuth(request) {
  const user = requireAuthenticatedUser(request).user;

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
