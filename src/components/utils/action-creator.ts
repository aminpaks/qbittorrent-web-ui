export type ActionUnion<T> = T extends Record<string, infer AC>
  ? AC extends (...args: any) => infer R
    ? R
    : never
  : never;

export type BasicAction<T, P> = { type: T; payload: P };

export const actionCreator = <T extends string>(type: T) => <P extends object>() => (
  payload: P
): BasicAction<T, P> => ({ type, payload });
