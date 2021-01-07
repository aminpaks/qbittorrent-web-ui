import { NotificationSeverity } from './types';
import { actionCreator } from './utils';

export const create = actionCreator('create')<{ message: string; severity?: NotificationSeverity }>();
export const remove = actionCreator('remove')<{ id: string }>();
export const cleanup = actionCreator('cleanup')<{ id: string }>();
