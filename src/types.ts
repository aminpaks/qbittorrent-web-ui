import { Torrent } from './api';

export type Lazy<T> = () => T;
export type LazyReason<T> = (reason: unknown) => T;
export type Fallback<T> = Lazy<T> | T;
export type FallbackReason<T> = LazyReason<T> | T;

export type TorrentCollection = Record<string, Torrent>;

export type NoOp = () => void;
