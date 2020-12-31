type ReturnType<T> = T extends () => Promise<infer R1> ? R1 : T extends () => infer R2 ? R2 : T;

export const tryCatchSync = <T extends () => unknown>(
  lazy: T,
  fallback: ((reason: unknown) => ReturnType<T>) | ReturnType<T>
): ReturnType<T> => {
  let reason: unknown;
  try {
    const result = lazy();
    return result as ReturnType<T>;
  } catch (e) {
    reason = e;
  }
  return typeof fallback === 'function' ? fallback(reason) : fallback;
};

export const tryCatch = async <T extends () => Promise<unknown>>(
  lazy: T,
  fallback: ((reason: unknown) => ReturnType<T>) | ReturnType<T>
): Promise<ReturnType<T>> => {
  let reason: unknown;
  try {
    const result = await lazy();
    return result as ReturnType<T>;
  } catch (e) {
    reason = e;
  }
  return typeof fallback === 'function' ? fallback(reason) : fallback;
};
