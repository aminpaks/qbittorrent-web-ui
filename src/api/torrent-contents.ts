import { request } from './request';
import { buildEndpointUrl } from './utils';

export const apiV2TorrentContents = (hash: string) => {
  return request(buildEndpointUrl(`/api/v2/torrents/files`));
};
