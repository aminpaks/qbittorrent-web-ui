import { getFormData, getFormDataFileList } from '../utils';
import { apiRequest, request } from './request';
import { buildEndpointUrl, buildError } from './utils';

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
  resume: never;
  pause: never;
  setForceStart: { value: boolean };
  delete: { hardDelete: boolean };
  setLocation: { location: string };
  rename: { name: string };
  setAutoManagement: { enable: boolean };
  setSuperSeeding: { value: boolean };
  setDownloadLimit: { limit: number };
  setUploadLimit: { limit: number };
  setShareLimits: { ratioLimit: number; seedingTimeLimit: number };
  toggleSequentialDownload: never;
  toggleFirstLastPiecePrio: never;
  topPrio: never;
  increasePrio: never;
  decreasePrio: never;
  bottomPrio: never;
  recheck: never;
  reannounce: never;
};
type HashPayload = { hash: string };
type HashListPayload = { hashes: string };
type TorrentOperationPayload = {
  resume: HashListPayload;
  pause: HashListPayload;
  setForceStart: { value: boolean } & HashListPayload;
  delete: { deleteFiles: boolean } & HashListPayload;
  setLocation: { location: string } & HashListPayload;
  rename: { name: string } & HashPayload;
  setAutoManagement: { enable: boolean } & HashListPayload;
  setSuperSeeding: { value: boolean } & HashListPayload;
  setDownloadLimit: { limit: number } & HashListPayload;
  setUploadLimit: { limit: number } & HashListPayload;
  setShareLimits: { ratioLimit: number; seedingTimeLimit: number } & HashListPayload;
  toggleSequentialDownload: never & HashListPayload;
  toggleFirstLastPiecePrio: never & HashListPayload;
  topPrio: HashListPayload;
  increasePrio: HashListPayload;
  decreasePrio: HashListPayload;
  bottomPrio: HashListPayload;
  recheck: HashListPayload;
  reannounce: HashListPayload;
};
type TorrentPrimitiveOperationOrder = [
  'resume',
  'pause',
  'setForceStart',
  'delete',
  'setLocation',
  'rename',
  'setAutoManagement',
  'setSuperSeeding',
  'setDownloadLimit',
  'setUploadLimit',
  'setShareLimits',
  'toggleSequentialDownload',
  'toggleFirstLastPiecePrio',
  'topPrio',
  'increasePrio',
  'decreasePrio',
  'bottomPrio',
  'recheck',
  'reannounce'
];

export type TorrentPrimitiveOperations = keyof TorrentPrimitiveOperationRecord;
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

export const apiV2TorrentsInfo = () => apiRequest<Torrent[]>(buildEndpointUrl(`/api/v2/torrents/info`));

const torrentsPrimitiveOperations: TorrentPrimitiveOperationOrder = [
  'resume',
  'pause',
  'setForceStart',
  'delete',
  'setLocation',
  'rename',
  'setAutoManagement',
  'setSuperSeeding',
  'setDownloadLimit',
  'setUploadLimit',
  'setShareLimits',
  'toggleSequentialDownload',
  'toggleFirstLastPiecePrio',
  'topPrio',
  'increasePrio',
  'decreasePrio',
  'bottomPrio',
  'recheck',
  'reannounce',
];

const getOperationFormParams = (
  hashList: string[],
  params: TorrentPrimitiveOperationOptions
): TorrentOperationPayload[typeof params[0]] => {
  const hash = hashList[0];
  const hashes = hashList.join('|');
  switch (params[0]) {
    case 'setForceStart':
    case 'setSuperSeeding':
      const { value = false } = params[1] || {};
      return { hashes, value };

    case 'setAutoManagement':
      const { enable = true } = params[1] || {};
      return { hashes, enable };

    case 'delete':
      const { hardDelete: deleteFiles = false } = params[1] || {};
      return { hashes, deleteFiles };

    case 'rename':
      const { name = '' } = params[1] || {};
      if (!name) {
        throw buildError(`Missing parameter "name"`);
      }
      return { hash, name };

    case 'setLocation':
      const { location = '' } = params[1] || {};
      if (!location) {
        throw buildError(`Missing parameter "Location"`);
      }
      return { hashes, location };

    case 'setDownloadLimit':
    case 'setUploadLimit':
      const { limit = 0 } = params[1] || {};
      return { hashes, limit };

    case 'setShareLimits':
      // The value -2 is global settings
      const { ratioLimit = -2, seedingTimeLimit = -2 } = params[1] || {};
      if (ratioLimit < -2 || seedingTimeLimit < -2) {
        throw buildError(`Invalid parameter limit "${JSON.stringify({ ratioLimit, seedingTimeLimit })}"`);
      }
      return { hashes, ratioLimit, seedingTimeLimit };

    default:
      return { hashes };
  }
};

export const apiV2TorrentsBasicAction = (hashList: string[], params: TorrentPrimitiveOperationOptions) => {
  if (!torrentsPrimitiveOperations.includes(params[0])) {
    throw buildError(`Not implemented (${params[0]})`);
  }

  return request(buildEndpointUrl(`/api/v2/torrents/${params[0]}`), {
    method: 'POST',
    body: getFormData(getOperationFormParams(hashList, params)),
  }).then(() => true);
};

export interface TorrentAddOptions {
  savepath: string; //	Download folder
  cookie: string; //	Cookie sent to download the .torrent file
  category: string; //	Category for the torrent
  tags: string; //	Tags for the torrent, split by ','
  skip_checking: string; //	Skip hash checking. Possible values are true, false (default)
  paused: string; //	Add torrents in the paused state. Possible values are true, false (default)
  root_folder: string; //	Create the root folder. Possible values are true, false, unset (default)
  rename: string; //	Rename torrent
  upLimit: number; //	Set torrent upload speed limit. Unit in bytes/second
  dlLimit: number; //	Set torrent download speed limit. Unit in bytes/second
  autoTMM: boolean; //	Whether Automatic Torrent Management should be used
  sequentialDownload: string; //	Enable sequential download. Possible values are true, false (default)
  firstLastPiecePrio: string; //	Prioritize download first last piece. Possible values are true, false (default)
}

export const apiV2TorrentsAddFile = (
  newItems: { files: File[]; _tag: 'file' } | { urls: string[]; _tag: 'url' },
  options = {} as Partial<TorrentAddOptions>
) => {
  const body =
    newItems._tag === 'file'
      ? getFormDataFileList(options, {
          fieldName: 'torrents',
          files: newItems.files,
        })
      : getFormData({
          ...options,
          urls: newItems.urls.join('\n'),
        });

  return request(buildEndpointUrl(`/api/v2/torrents/add`), {
    method: 'POST',
    body,
  }).then(() => true);
};
