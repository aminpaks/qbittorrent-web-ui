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
export type CategoryOperationPayload = {
  assign: { category: string; list: string[] };
  create: { category: string; savePath: string };
  edit: { category: string; savePath: string };
  delete: { categories: string[] };
};
export type CategoryOperation = keyof CategoryOperationPayload;
export type CategoryOperationOptions = {
  [K in CategoryOperation]: [operation: K, options: CategoryOperationPayload[K]];
}[CategoryOperation];

export type CategoryOperationResponse = [CategoryOperation, boolean];

export const apiV2CreateCategory = ({ category, savePath }: { category: string; savePath: string }) =>
  request(buildEndpointUrl(`/api/v2/torrents/createCategory`), {
    method: 'POST',
    body: getFormData({
      category,
      savePath,
    }),
  }).then(() => ['create', true] as CategoryOperationResponse);

export const apiV2EditCategory = ({ category, savePath }: { category: string; savePath: string }) =>
  request(buildEndpointUrl(`/api/v2/torrents/editCategory`), {
    method: 'POST',
    body: getFormData({
      category,
      savePath,
    }),
  }).then(() => ['edit', true] as CategoryOperationResponse);

export const apiV2DeleteCategory = ({ categories }: { categories: string[] }) =>
  request(buildEndpointUrl(`/api/v2/torrents/removeCategories`), {
    method: 'POST',
    body: getFormData({
      categories: categories.join('\n'),
    }),
  }).then(() => ['delete', true] as CategoryOperationResponse);

export const apiV2AssignToCategory = ({ category, list }: { category: string; list: string[] }) =>
  request(buildEndpointUrl(`/api/v2/torrents/setCategory`), {
    method: 'POST',
    body: getFormData({
      category,
      hashes: list.join('|'),
    }),
  }).then(() => ['assign', true] as CategoryOperationResponse);

export const apiV2OperateCategory = (params: CategoryOperationOptions) => {
  switch (params[0]) {
    case 'assign':
      return apiV2AssignToCategory(params[1]);
    case 'create':
      return apiV2CreateCategory(params[1]);
    case 'edit':
      return apiV2EditCategory(params[1]);
    case 'delete':
      return apiV2DeleteCategory(params[1]);
    default:
      throw new Error('Invalid operation');
  }
};
