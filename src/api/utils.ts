import { API_BASE_URL } from '../constant';

export const buildUrl = (url: string, base?: string) => new URL(url, base);
export const buildEndpointUrl = (endpoint: string) => buildUrl(endpoint, API_BASE_URL).toString();
