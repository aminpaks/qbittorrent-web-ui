import { Fallback } from '../types';
import { tryCatchSync } from './try-catch';

const version = '0.0.1';
type KeyValue<V> = {
  [key: string]: V;
} & { v: string };

export const storageGet = <T>(key: string, fallback: Fallback<NonNullable<T>>): T => {
  return tryCatchSync(() => {
    const r = JSON.parse(localStorage.getItem(key) ?? '{:INVALID:}') as KeyValue<T>;
    if (r.v === version && r[key] != null) {
      return r[key];
    }
    throw r;
  }, fallback);
};

export const storageSet = <T>(key: string, value: T): T => {
  const serializedValue = JSON.stringify({ [key]: value, v: version } as KeyValue<T>);
  localStorage.setItem(key, serializedValue);
  return value;
};

export const storageRemove = (key: string): void => {
  localStorage.removeItem(key);
};
