import { TorrentKeys } from '../../types';

export interface SortFilterStateValue {
  column: TorrentKeys;
  asc: boolean;
  search: string;
}
export type SortFilterState = [SortFilterStateValue, SortFilterHandler];
export type SortFilterHandler = (payload: { column?: TorrentKeys; search?: string }) => void;
