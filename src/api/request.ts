import { tryCatch, tryCatchSync } from '../utils';
import { buildError, getHeaders } from './utils';

export const rawRequest = (url: string, options?: RequestInit) => fetch(url, options);

export const request = async (url: string, options?: RequestInit) => {
  const response = await rawRequest(url, options);

  const text = await response.text();
  if (response.ok) {
    return text;
  }

  throw buildError(text, { response, object: { message: text } });
};

export const requestJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await rawRequest(url, options);

  if (response.ok) {
    return response.json();
  }

  const text = await tryCatch(() => response.text(), `{INVALID_JSON}`);
  const object = tryCatchSync<{ message: string }>(() => JSON.parse(text), {
    message: text || 'Unknown error',
  });

  throw buildError(object.message, { response, object });
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // Add content-type to headers for all api requests
  const headers = getHeaders(options.headers);
  headers.set('content-type', 'application/json');

  return requestJson(endpoint, { ...options, headers });
};
