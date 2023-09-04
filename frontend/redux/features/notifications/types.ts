export type NotificationLevel = 'info' | 'warning' | 'error'

export type NotificationProps = {
  shouldShow?: boolean,
  message: string,
  actionButtonText?: string,
  onActionClickCallback?: Function,
  closeOnAction?: boolean,
  level?: NotificationLevel,
}

export type NotificationQueueState = {
  queue: NotificationProps[],
  currentNotification?: NotificationProps
}