import { tryCatch, tryCatchSync } from '../utils';

export const request = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);

  if (response.status >= 200 && response.status < 400) {
    return response.json();
  }

  const text = await tryCatch(() => response.text(), `{INVALID_JSON}`);
  const jsonError = tryCatchSync(() => JSON.parse(text), { message: text || 'Unknown error' });

  throw jsonError;
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // Add content-type to headers for all api requests
  const { headers: originalHeaders } = options;
  const headers = new Headers(Object.entries(originalHeaders ?? {}));
  headers.set('content-type', 'application/json');

  const response = await request(endpoint, { ...options, headers });
  const json = await response.json();

  return json;
};
