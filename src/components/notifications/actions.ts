import { ReactNode } from 'react';
import { NotificationSeverity } from './types';
import { actionCreator } from './utils';

export const create = actionCreator('create')<{ message: ReactNode; severity?: NotificationSeverity }>();
export const remove = actionCreator('remove')<{ id: string }>();
export const cleanup = actionCreator('cleanup')<{ id: string }>();
