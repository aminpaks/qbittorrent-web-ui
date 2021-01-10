import { ReactNode } from 'react';
import { create, remove, cleanup } from './actions';

export interface Notification {
  id: string;
  message: ReactNode;
  state: 'idle' | 'remove' | 'cleanup';
  severity: NotificationSeverity;
}
export type NotificationSeverity = 'success' | 'error' | 'info' | 'warning';
export interface NotificationsState {
  queue: Notification[];
}
export type NotificationsActions =
  | ReturnType<typeof create>
  | ReturnType<typeof remove>
  | ReturnType<typeof cleanup>;
