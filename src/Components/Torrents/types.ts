import { TorrentKeys } from '../../api';

export type ExtendedTorrentKeys = TorrentKeys | 'index' | 'action' | 'invalid';

export interface TableColumn {
  label: string;
  dataKey: ExtendedTorrentKeys;
  width: number;
  align?: 'right' | 'left';
}

export type CellTargetHandler = (element: Element, eventType: 'select' | 'context') => void;
