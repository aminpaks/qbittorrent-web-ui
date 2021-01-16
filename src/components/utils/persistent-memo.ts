import { useCallback, useMemo, useRef } from 'react';
import { Lazy } from '../../types';

export const usePersistentMemo = <T>(lazy: Lazy<T>, deps: unknown[]) => {
  const valueRef = useRef(null as T | null);
  const isPersistingRef = useRef(false);
  const persist = useCallback((shouldPersist: boolean = true) => {
    isPersistingRef.current = shouldPersist;
  }, []);
  const value = useMemo(() => {
    if (!isPersistingRef.current) {
      const result = lazy();
      valueRef.current = result;
      return result;
    }
    return valueRef.current as T;
  }, deps);

  return [value, persist] as [T, typeof persist];
};
