import { Lazy, FallbackReason } from '../types';
import { runFallbackReason } from './functions';

export const tryCatchSync = <T>(lazy: Lazy<T>, fallback: FallbackReason<NonNullable<T>>): NonNullable<T> => {
  let reason: unknown;
  try {
    const result = lazy();
    if (result != null) {
      return result as NonNullable<T>;
    }
  } catch (e) {
    reason = e;
  }
  return runFallbackReason(fallback, reason);
};

export const tryCatch = async <T>(
  lazy: Lazy<Promise<T>>,
  fallback: FallbackReason<NonNullable<T>>
): Promise<NonNullable<T>> => {
  let reason: unknown;
  try {
    const result = await lazy();
    if (result != null) {
      return Promise.resolve(result) as Promise<NonNullable<T>>;
    }
  } catch (e) {
    reason = e;
  }
  return runFallbackReason(fallback, reason);
};
