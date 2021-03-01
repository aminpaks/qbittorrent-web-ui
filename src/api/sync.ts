import { Category, CategoryCollection } from './category';
import { requestJson } from './request';
import { Torrent } from './torrents';
import { buildEndpointUrl } from './utils';

export type ConnectionStatus = 'connected' | 'firewalled' | 'disconnected';

export interface ServerState {
  dl_info_speed: number; //	Global download rate (bytes/s)
  dl_info_data: number; //	Data downloaded this session (bytes)
  up_info_speed: number; //	Global upload rate (bytes/s)
  up_info_data: number; //	Data uploaded this session (bytes)
  dl_rate_limit: number; //	Download rate limit (bytes/s)
  up_rate_limit: number; //	Upload rate limit (bytes/s)
  dht_nodes: number; //	DHT nodes connected to
  connection_status: ConnectionStatus; //	Connection status. See possible values here below
  free_space_on_disk: number;
}

export interface SyncMaindata {
  rid: number; //	Response ID
  full_update: boolean; //	Whether the response contains all the data or partial data
  torrents?: Record<string, Partial<Torrent>>; //	Property: torrent hash, value: same as torrent list
  torrents_removed?: string[]; //	List of hashes of torrents removed since last request
  categories: CategoryCollection; //	Info for categories added since last request
  categories_removed?: string[]; //	List of categories removed since last request
  tags?: unknown[]; //	List of tags added since last request
  tags_removed?: unknown[]; //	List of tags removed since last request
  server_state?: ServerState; //	Global transfer info
}

export const apiV2SyncMaindata = (rid = 0) =>
  requestJson<SyncMaindata>(buildEndpointUrl(`/api/v2/sync/maindata?rid=${rid}`));
