'use client';

import { useAuth } from '@/contexts/AuthContext';

export function useAuthenticatedFetch() {
  const { token } = useAuth();

  const fetchWithAuth = async (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    const hasBody = Object.prototype.hasOwnProperty.call(options, 'body');
    const isFormData = hasBody && options.body instanceof FormData;

    if (!headers.has('Content-Type') && !isFormData) {
      headers.set('Content-Type', 'application/json');
    }

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Request failed: ${response.status}`);
    }

    return response.json();
  };

  return fetchWithAuth;
}
