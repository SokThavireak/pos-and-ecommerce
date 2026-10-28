import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth';

export interface BackendHealthResponse {
  status: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  clientOrigin: string;
  cors: {
    enabled: boolean;
    allowedOrigins: string;
  };
  database: {
    connected: boolean;
    provider: string;
    isNeon: boolean;
    database: string;
    latencyMs: number;
  };
}

export interface ConnectivityResult {
  connected: boolean;
  backendUrl: string;
  latencyMs: number;
  health?: BackendHealthResponse;
  error?: string;
}

export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  /**
   * Resolves backend URL from Nuxt runtime config (process.env.NUXT_PUBLIC_BACKEND_URL)
   * Ensures trailing slashes are cleanly stripped.
   */
  const getBackendUrl = (): string => {
    const raw = (config.public.backendUrl as string) || 'http://localhost:3001';
    return raw.replace(/\/+$/, '');
  };

  /**
   * Universal fetch wrapper configured for cross-origin deployment
   */
  const apiFetch = async <T = any>(
    path: string,
    options: Parameters<typeof $fetch>[1] = {},
  ): Promise<T> => {
    const backendUrl = getBackendUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${backendUrl}${cleanPath}`;

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Auto-inject JWT token from auth store for authenticated requests
    if (authStore.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${authStore.token}`;
    }

    return $fetch<T>(url, {
      ...options,
      headers,
    });
  };

  /**
   * Diagnostic test function to verify cross-origin frontend-to-backend connectivity
   */
  const checkBackendConnection = async (): Promise<ConnectivityResult> => {
    const backendUrl = getBackendUrl();
    const start = Date.now();

    try {
      const data = await apiFetch<BackendHealthResponse>('/api/health');
      return {
        connected: data.status === 'healthy' || data.database?.connected,
        backendUrl,
        latencyMs: Date.now() - start,
        health: data,
      };
    } catch (err: any) {
      return {
        connected: false,
        backendUrl,
        latencyMs: Date.now() - start,
        error: err.message || 'Network error or CORS policy blocked request.',
      };
    }
  };

  return {
    getBackendUrl,
    apiFetch,
    checkBackendConnection,
    get: <T = any>(path: string, opts = {}) => apiFetch<T>(path, { method: 'GET', ...opts }),
    post: <T = any>(path: string, body?: any, opts = {}) =>
      apiFetch<T>(path, { method: 'POST', body, ...opts }),
    patch: <T = any>(path: string, body?: any, opts = {}) =>
      apiFetch<T>(path, { method: 'PATCH', body, ...opts }),
    delete: <T = any>(path: string, opts = {}) =>
      apiFetch<T>(path, { method: 'DELETE', ...opts }),
  };
}

