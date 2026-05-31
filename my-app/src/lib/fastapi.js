const DEFAULT_FASTAPI_URL = 'http://127.0.0.1:8000';

export function getFastApiBaseUrl() {
  const configured =
    process.env.FASTAPI_URL ||
    process.env.AI_SERVICE_URL ||
    DEFAULT_FASTAPI_URL;

  return configured.replace('://localhost', '://127.0.0.1').replace(/\/$/, '');
}