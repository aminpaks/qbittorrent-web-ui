import { ReactNode } from 'react';
import { TorrentKeys, TorrentState } from '../../api';

export type ExtendedTorrentKeys = TorrentKeys | 'action' | 'invalid';

export interface TableColumn {
  label: ReactNode;
  dataKey: ExtendedTorrentKeys;
  width: number;
  align?: 'right' | 'left';
}

export type CellTargetHandler = (element: Element, eventType: 'select' | 'context') => void;

export interface ContextOpsState {
  isOnlyOne: boolean;
  firstState: TorrentState;
  areAllStateSame: boolean;
  hasCompletedItems: boolean;
  hasDownloadingItems: boolean;
}

export type ShareLimitType = 'globalLimit' | 'noLimit' | 'individual';

export interface NewTorrentOptions {
  savePath: string;
  rootFolder: string;
  name: string;
  cookie: string;
  category: string;
  tags: string[];
  autoStart: boolean;
  skipHashChecking: boolean;
  uploadLimit: number;
  downloadLimit: number;
  autoManagement: boolean;
  sequentialDownload: boolean;
  firstLastPiecePrioritized: boolean;
}
