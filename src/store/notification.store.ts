/**
 * Notification Store — manages toasts and alert state.
 * Replace with Redux/Zustand when you integrate a state manager.
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface NotificationState {
  notifications: Notification[];
}

export const initialNotificationState: NotificationState = {
  notifications: [],
};
