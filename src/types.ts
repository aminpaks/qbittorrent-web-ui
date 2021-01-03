import { Torrent } from './api';

export type Lazy<T> = () => T;

export type TorrentCollection = Record<string, Torrent>;
