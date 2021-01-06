export const unsafeMutateObject = <T extends object>(draft: T) => (obj: unknown) => {
  const keys = Object.keys(draft);
  for (const key of keys) {
    (obj as any)[key] = (draft as any)[key];
  }

  return obj;
};

export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]) => {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as Pick<T, K>);
};
