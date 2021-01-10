import { BasicAction } from '../utils';

export const actionCreator = <T extends string>(type: T) => <P extends object>() => (
  payload: P
): BasicAction<T, P> => ({ type, payload });
