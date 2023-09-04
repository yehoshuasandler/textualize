import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import notificationQueueSlice from './features/notifications/notificationQueueSlice'
import stageSlice from './features/stage/stageSlice'

export const store = configureStore({
  reducer: {
    notificationQueue: notificationQueueSlice,
    stage: stageSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
