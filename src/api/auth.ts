import { apiRequest } from './request';
import { buildEndpointUrl } from './utils';

export const requestAuthLoginV2 = (username: string = 'admin', password: string = 'adminadmin') =>
  apiRequest(buildEndpointUrl(`/api/v2/auth/login`), {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
  });
