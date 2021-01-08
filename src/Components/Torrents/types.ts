import { ReactNode } from 'react';
import { TorrentKeys, TorrentPrimitiveOperations } from '../../api';

export type ExtendedTorrentKeys = TorrentKeys | 'action' | 'invalid';

export interface TableColumn {
  label: ReactNode;
  dataKey: ExtendedTorrentKeys;
  width: number;
  align?: 'right' | 'left';
}

export type CellTargetHandler = (element: Element, eventType: 'select' | 'context') => void;

export type ContextAction = 'noop' | 'copyName' | 'copyHash' | 'copyMagnetLink' | TorrentPrimitiveOperations;
export type ContextActionOrder = [
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
