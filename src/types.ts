import { Torrent } from './api';

export type Lazy<T> = () => T;
export type LazyReason<T, R = unknown> = (reason: R) => T;
export type Fallback<T> = Lazy<T> | T;
export type FallbackReason<T> = LazyReason<T> | T;

export type TorrentCollection = Record<string, Torrent>;

export type NoOp = () => void;

// Reference https://github.com/Microsoft/TypeScript/issues/13298#issuecomment-707364842
export type UnionToTuple<T> = (
  (T extends any ? (t: T) => T : never) extends infer U
    ? (U extends any ? (u: U) => any : never) extends (v: infer V) => any
      ? V
      : never
    : never
) extends (_: any) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];
