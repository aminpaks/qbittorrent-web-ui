import { request } from './request';

export const apiV2AppVersion = () =>
  request(`/api/v2/app/version`).then(response => {
    console.log('app version:', response);
    return response;
  });

export const apiV2WebApiVersion = () => request(`/api/v2/app/webapiVersion`);
