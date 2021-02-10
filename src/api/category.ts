import { request } from './request';
import { buildEndpointUrl } from './utils';
import { getFormData } from '../utils';

export interface Category {
  __internal: string | false;
  name: string;
  savePath: string;
  hashList: string[];
}

export type CategoryCollection = Record<string, Category>;

export const apiV2SetCategory = (category: string, list: string[]) =>
  request(buildEndpointUrl(`/api/v2/setCategory`), {
    body: getFormData({
      hashes: list,
      category,
    }),
  }).then(() => true);
