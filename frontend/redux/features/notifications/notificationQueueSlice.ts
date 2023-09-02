import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { NotificationProps, NotificationQueueState } from './types'

const initialState: NotificationQueueState = {
  currentNotification: undefined,
  queue: []
}

export const notificationQueueSlice = createSlice({
  name: 'propertyList',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationProps[]>) => {
      state.queue = action.payload
    },
    setCurrentNotification: (state, action: PayloadAction<NotificationProps | undefined>) => {
      state.currentNotification = action.payload
    },
    pushNotification: (state, action: PayloadAction<NotificationProps>) => {
      let { queue } = state
      const { payload: newNotification } = action

      if (queue.length) queue.push(newNotification)
      else {
        queue.push(newNotification)
        state.currentNotification = newNotification
      }
    },
    dismissCurrentNotification: (state) => {
      state.queue.shift()
      state.currentNotification = state.queue[0] || undefined
    }
  }
})

export const {
  setNotifications,
  setCurrentNotification,
  pushNotification,
  dismissCurrentNotification
} = notificationQueueSlice.actions

export default notificationQueueSlice.reducer