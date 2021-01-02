import { Lazy } from '../types';

export const tryCatchSync = <T>(lazy: Lazy<T>, fallback: ((reason: unknown) => T) | T): T => {
  let reason: unknown;
  try {
    return lazy();
  } catch (e) {
    reason = e;
  }
  return typeof fallback === 'function' ? (fallback as Function)(reason) : fallback;
};

export const tryCatch = async <T>(
  lazy: Lazy<Promise<T>>,
  fallback: ((reason: unknown) => T) | T
): Promise<T> => {
  let reason: unknown;
  try {
    const result = await lazy();
    return Promise.resolve(result);
  } catch (e) {
    reason = e;
  }
  return typeof fallback === 'function' ? (fallback as Function)(reason) : fallback;
};
