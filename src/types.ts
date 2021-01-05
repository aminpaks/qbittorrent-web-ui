import { Torrent } from './api';

export type Lazy<T> = () => T;
export type Fallback<T> = Lazy<T> | T;
export type FallbackReason<T> = ((reason: unknown) => T) | T;

export type TorrentCollection = Record<string, Torrent>;
