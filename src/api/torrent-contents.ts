import { apiRequest } from './request';
import { buildEndpointUrl } from './utils';
import { buildSearchParams } from '../utils';

export interface TorrentContent {
  name: string;
  size: number;
  priority: number;
  progress: number;
  availability: number;
  piece_range: [number, number];
  is_seed: boolean;
}

export const apiV2TorrentContents = (hash: string) => {
  return apiRequest<TorrentContent[]>(
    buildEndpointUrl(`/api/v2/torrents/files?${buildSearchParams({ hash })}`)
  );
};
