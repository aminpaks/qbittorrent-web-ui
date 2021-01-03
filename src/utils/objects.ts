export const unsafeMutateObject = <T extends object>(draft: T) => (obj: unknown) => {
  const keys = Object.keys(draft);
  for (const key of keys) {
    (obj as any)[key] = (draft as any)[key];
  }

  return obj;
};
