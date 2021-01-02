import { Lazy } from '../types';

export const tryCatchSync = <T>(
  lazy: Lazy<T>,
  fallback: ((reason: unknown) => T) | T
): NonNullable<T> => {
  let reason: unknown;
  try {
    const result = lazy();
    if (result != null) {
      return result as NonNullable<T>;
    }
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
