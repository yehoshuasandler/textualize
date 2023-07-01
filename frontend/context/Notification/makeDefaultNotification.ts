import { NotificationContextType } from './types';

const makeDefaultNotification = (): NotificationContextType => ({
  addNotificationToQueue: (_) => {},
})

export default makeDefaultNotification
