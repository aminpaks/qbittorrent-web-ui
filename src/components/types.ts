import { TorrentPrimitiveOperations } from '../api';

export type ContextOps = 'noop' | 'copyName' | 'copyHash' | 'copyMagnetLink' | TorrentPrimitiveOperations;
export type ContextOpsOrder = [
  'noop',
  'resume',
  'pause',
  'setForceStart',
  'delete',
  'setLocation',
  'rename',
  'setAutoManagement',
  'setDownloadLimit',
  'setUploadLimit',
  'setShareLimits',
  'setSuperSeeding',
  'toggleSequentialDownload',
  'toggleFirstLastPiecePrio',
  'topPrio',
  'increasePrio',
  'decreasePrio',
  'bottomPrio',
  'recheck',
  'reannounce',
  'copyName',
  'copyHash',
  'copyMagnetLink'
];

export type ContextOpsSetting = [ContextOps, boolean];
