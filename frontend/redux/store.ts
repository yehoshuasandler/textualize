import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import notificationQueueSlice from './features/notifications/notificationQueueSlice'
import stageSlice from './features/stage/stageSlice'
import sessionSlice from './features/session/sessionSlice'

export const store = configureStore({
  reducer: {
    notificationQueue: notificationQueueSlice,
    stage: stageSlice,
    session: sessionSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)
