import { API_BASE_URL } from '../constant';

export const buildUrl = (url: string, base?: string) => new URL(url, base);
export const buildEndpointUrl = (endpoint: string) => buildUrl(endpoint, API_BASE_URL).toString();

export const buildError = (
  errorMessage = 'Unknown error!',
  { response, object }: { response?: Response; object?: object } = {}
) => {
  const error: any = new Error(errorMessage || 'Unknown API failure!');
  error.status = response?.status ?? 0 /* INVALID */;
  error.statusText = response?.statusText ?? 'INVALID';
  error.response = response;
  error.object = object;

  return error;
};

export const getHeaders = (v?: object | Headers) => {
  if (v instanceof Headers) {
    return v;
  }
  return new Headers(Object.entries(v ?? {}));
};

export const getErrorMessage = (error: any) => {
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message;
  }

  return 'Unknown failure!';
};
