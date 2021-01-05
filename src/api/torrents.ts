import { getFormData } from '../utils';
import { apiRequest, request } from './request';
import { buildError } from './utils';

export type TorrentState =
  | 'error' //	Some error occurred, applies to paused torrents
  | 'missingFiles' //	Torrent data files is missing
  | 'uploading' //	Torrent is being seeded and data is being transferred
  | 'pausedUP' //	Torrent is paused and has finished downloading
  | 'queuedUP' //	Queuing is enabled and torrent is queued for upload
  | 'stalledUP' //	Torrent is being seeded, but no connection were made
  | 'checkingUP' //	Torrent has finished downloading and is being checked
  | 'forcedUP' //	Torrent is forced to uploading and ignore queue limit
  | 'allocating' //	Torrent is allocating disk space for download
  | 'downloading' //	Torrent is being downloaded and data is being transferred
  | 'metaDL' //	Torrent has just started downloading and is fetching metadata
  | 'pausedDL' //	Torrent is paused and has NOT finished downloading
  | 'queuedDL' //	Queuing is enabled and torrent is queued for download
  | 'stalledDL' //	Torrent is being downloaded, but no connection were made
  | 'checkingDL' //	Same as checkingUP, but torrent has NOT finished downloading
  | 'forcedDL' //	Torrent is forced to downloading to ignore queue limit
  | 'checkingResumeData' //	Checking resume data on qBt startup
  | 'moving' //	Torrent is moving to another location
  | 'unknown'; //	Unknown status

type TorrentPrimitiveOperationRecord = {
  pause: never;
  resume: never;
  recheck: never;
  reannounce: never;
  increasePrio: never;
  decreasePrio: never;
  topPrio: never;
  bottomPrio: never;
  toggleSequentialDownload: never;
  toggleFirstLastPiecePrio: never;

  delete: { hardDelete: boolean };
  setForceStart: { value: boolean };
  setSuperSeeding: { value: boolean };
  setAutoManagement: { enable: boolean };
};
export type TorrentPrimitiveOperations = keyof TorrentPrimitiveOperationRecord;
type TorrentBasicActionOption<K extends TorrentPrimitiveOperations> = TorrentPrimitiveOperationRecord[K];

export type TorrentPrimitiveOperationOptions = {
  [K in TorrentPrimitiveOperations]: TorrentPrimitiveOperationRecord[K] extends never
    ? [action: K]
    : [action: K, options: TorrentPrimitiveOperationRecord[K]];
}[TorrentPrimitiveOperations];

export type TorrentKeys = keyof Torrent;

export interface Torrent {
  added_on: number; //	Time (Unix Epoch) when the torrent was added to the client
  amount_left: number; //	Amount of data left to download (bytes)
  auto_tmm: boolean; //	Whether this torrent is managed by Automatic Torrent Management
  availability: number; //	Percentage of file pieces currently available
  category: string; //	Category of the torrent
  completed: number; //	Amount of transfer data completed (bytes)
  completion_on: number; //	Time (Unix Epoch) when the torrent completed
  content_path: string; //	Absolute path of torrent content (root path for multifile torrents, absolute file path for singlefile torrents)
  dl_limit: number; //	Torrent download speed limit (bytes/s). -1 if ulimited.
  dlspeed: number; //	Torrent download speed (bytes/s)
  downloaded: number; //	Amount of data downloaded
  downloaded_session: number; //	Amount of data downloaded this session
  eta: number; //	Torrent ETA (seconds)
  f_l_piece_prio: boolean; //	True if first last piece are prioritized
  force_start: boolean; //	True if force start is enabled for this torrent
  hash: string; //	Torrent hash
  last_activity: number; //	Last time (Unix Epoch) when a chunk was downloaded/uploaded
  magnet_uri: string; //	Magnet URI corresponding to this torrent
  max_ratio: number; //	Maximum share ratio until torrent is stopped from seeding/uploading
  max_seeding_time: number; //	Maximum seeding time (seconds) until torrent is stopped from seeding
  name: string; //	Torrent name
  num_complete: number; //	Number of seeds in the swarm
  num_incomplete: number; //	Number of leechers in the swarm
  num_leechs: number; //	Number of leechers connected to
  num_seeds: number; //	Number of seeds connected to
  priority: number; //	Torrent priority. Returns -1 if queuing is disabled or torrent is in seed mode
  progress: number; //	Torrent progress (percentage/100)
  ratio: number; //	Torrent share ratio. Max ratio value: 9999.
  ratio_limit: number; //	TODO (what is different from max_ratio?)
  save_path: string; //	Path where this torrent's data is stored
  seeding_time_limit: number; //	TODO (what is different from max_seeding_time?)
  seen_complete: number; //	Time (Unix Epoch) when this torrent was last seen complete
  seq_dl: boolean; //	True if sequential download is enabled
  size: number; //	Total size (bytes) of files selected for download
  state: TorrentState; //	Torrent state. See TorrentState
  super_seeding: boolean; //	True if super seeding is enabled
  tags: string; //	Comma-concatenated tag list of the torrent
  time_active: number; //	Total active time (seconds)
  total_size: number; //	Total size (bytes) of all file in this torrent (including unselected ones)
  tracker: string; //	The first tracker with working status. Returns empty string if no tracker is working.
  up_limit: number; //	Torrent upload speed limit (bytes/s). -1 if ulimited.
  uploaded: number; //	Amount of data uploaded
  uploaded_session: number; //	Amount of data uploaded this session
  upspeed: number; //	Torrent upload speed (bytes/s)
}

export const apiV2TorrentsInfo = () => apiRequest<Torrent[]>(`/api/v2/torrents/info`);

const torrentsPrimitiveOperations: TorrentPrimitiveOperations[] = [
  'pause',
  'resume',
  'recheck',
  'delete',
  'reannounce',
  'setForceStart',
  'setSuperSeeding',
  'increasePrio',
  'decreasePrio',
  'topPrio',
  'bottomPrio',
  'setAutoManagement',
  'toggleSequentialDownload',
  'toggleFirstLastPiecePrio',
];

const getOperationFormParams = (
  ...args: TorrentPrimitiveOperationOptions
): TorrentBasicActionOption<typeof args[0]> | {} => {
  switch (args[0]) {
    case 'setForceStart':
    case 'setSuperSeeding':
      const { value = false } = args[1] || {};
      return { value };
    case 'setAutoManagement':
      const { enable = true } = args[1] || {};
      return { enable };
    case 'delete':
      return { hardDelete: false };
    case 'resume':
    case 'pause':
    case 'recheck':
    case 'reannounce':
    case 'increasePrio':
    case 'decreasePrio':
    case 'topPrio':
    case 'bottomPrio':
    case 'toggleSequentialDownload':
    case 'toggleFirstLastPiecePrio':
    default:
      return {};
  }
};

export const apiV2TorrentsBasicAction = (hashList: string[], params: TorrentPrimitiveOperationOptions) => {
  if (!torrentsPrimitiveOperations.includes(params[0])) {
    throw buildError(`Not implemented (${params[0]})`);
  }

  if (params[0] === 'delete') {
    console.log('delete? really?');
    return Promise.resolve(false);
  }

  return request(`/api/v2/torrents/${params[0]}`, {
    method: 'POST',
    body: getFormData({
      hashes: hashList.join('|'),
      ...getOperationFormParams(...params),
    }),
  }).then(() => true);
};
