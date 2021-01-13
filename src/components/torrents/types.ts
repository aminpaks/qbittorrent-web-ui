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
