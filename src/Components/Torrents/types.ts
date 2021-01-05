import { ReactNode } from 'react';
import { TorrentKeys, TorrentPrimitiveOperations } from '../../api';

export type ExtendedTorrentKeys = TorrentKeys | 'index' | 'action' | 'invalid';

export interface TableColumn {
  label: ReactNode;
  dataKey: ExtendedTorrentKeys;
  width: number;
  align?: 'right' | 'left';
}

export type CellTargetHandler = (element: Element, eventType: 'select' | 'context') => void;

export type ContextAction = TorrentPrimitiveOperations | 'invalid';
