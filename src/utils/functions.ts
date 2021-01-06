import { Fallback, FallbackReason } from '../types';

export const noop = () => {};
export const runFallback = <T>(i: Fallback<T>): T => (typeof i === 'function' ? (i as Function)() : i);
export const runFallbackReason = <T>(i: FallbackReason<T>, reason: unknown): T =>
  typeof i === 'function' ? (i as Function)(reason) : i;

export const delay = (milliseconds = 100) => new Promise(resolve => setTimeout(resolve, milliseconds));
