
'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getFriendlyApiErrorMessage } from '@/lib/error-messages';

export function useAuthenticatedFetch() {
  const { token } = useAuth();

  const fetchWithAuth = useCallback(async (url, options = {}) => {
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
      let errorPayload = {};
      const contentType = response.headers.get('content-type') || '';

      try {
        if (contentType.includes('application/json')) {
          errorPayload = await response.json();
        } else {
          errorPayload = { error: await response.text() };
        }
      } catch {
        errorPayload = {};
      }

      const error = new Error(
        getFriendlyApiErrorMessage(
          {
            message: errorPayload.error || errorPayload.detail || `Request failed: ${response.status}`,
            status: response.status,
          },
          `Request failed: ${response.status}`
        )
      );
      error.status = response.status;
      throw error;
    }

    return response.json();
  }, [token]);

  return fetchWithAuth;
}
