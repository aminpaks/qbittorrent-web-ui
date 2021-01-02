import { getFormData } from '../utils';
import { request } from './request';
import { buildEndpointUrl, buildError } from './utils';

export const apiV2AuthLogin = (
  username: string = 'admin',
  password: string = 'adminadmin'
): Promise<{ authenticated: boolean }> =>
  request(buildEndpointUrl(`/api/v2/auth/login`), {
    method: 'POST',
    body: getFormData({ username, password }),
  }).then(response => {
    if (response.indexOf('Ok') === 0) {
      return {
        authenticated: true,
      };
    }
    throw buildError('Authentication failed!', { object: { authenticated: false } });
  });
