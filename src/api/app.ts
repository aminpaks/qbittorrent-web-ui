import { request } from './request';
import { buildEndpointUrl } from './utils';

export const apiV2AppVersion = () => request(buildEndpointUrl(`/api/v2/app/version`));

export const apiV2WebApiVersion = () => request(buildEndpointUrl(`/api/v2/app/webapiVersion`));
