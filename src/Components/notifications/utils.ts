import { NotificationsAction } from './types';

export const actionCreator = <T extends string>(type: T) => <P extends object>() => (
  payload: P
): NotificationsAction<T, P> => ({ type, payload });
