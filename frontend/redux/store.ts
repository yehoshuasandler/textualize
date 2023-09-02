import { configureStore } from '@reduxjs/toolkit'
import notificationQueueSlice from './features/notifications/notificationQueueSlice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'

export const store = configureStore({
  reducer: {
    notificationQueue: notificationQueueSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
