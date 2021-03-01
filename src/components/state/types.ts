import { Category, TorrentKeys } from '../../api';

export type CategoryState = Record<string, Category>;

export interface SortFilterStateValue {
  column: TorrentKeys;
  asc: boolean;
  search: string;
  category: string;
}
export type SortFilterState = [SortFilterStateValue, SortFilterHandler];
export type SortFilterHandler = (payload: {
  column?: TorrentKeys;
  search?: string;
  category?: string;
}) => void;
