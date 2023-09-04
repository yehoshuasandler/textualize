import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ContextConnectionPoint, StageState } from './types'

export const maxScale = 4
export const scaleStep = 0.01

const initialState: StageState = {
  size: { width: 1, height: 1 },
  scale: 1,
  areAreasVisible: true,
  areProcessedWordsVisible: true,
  areTranslatedWordsVisible: false,
  areLinkAreaContextsVisible: false,
  isDrawingArea: false,
  startingContextConnectionPoint: null,
}

export const stageSlice = createSlice({
  name: 'stage',
  initialState,
  reducers: {
    setSize: (state, action: PayloadAction<{width: number, height: number}>) => {
      state.size = action.payload
    },
    setScale: (state, action: PayloadAction<number>) => {
      let clampedScale = action.payload

      if (clampedScale > maxScale) clampedScale = maxScale
      else if (clampedScale < scaleStep) clampedScale = scaleStep

      state.scale = clampedScale
    },
    setAreAreasVisible: (state, action: PayloadAction<boolean>) => {
      state.areAreasVisible = action.payload
    },
    setAreProcessedWordsVisible: (state, action: PayloadAction<boolean>) => {
      state.areProcessedWordsVisible = action.payload
    },
    setAreTranslatedWordsVisible: (state, action: PayloadAction<boolean>) => {
      state.areTranslatedWordsVisible = action.payload
    },
    setAreLinkAreaContextsVisible: (state, action: PayloadAction<boolean>) => {
      state.areLinkAreaContextsVisible = action.payload
    },
    setIsDrawingArea: (state, action: PayloadAction<boolean>) => {
      state.isDrawingArea = action.payload
    },
    setStartingContextConnectionPoint: (state, action: PayloadAction<ContextConnectionPoint | null>) => {
      state.startingContextConnectionPoint = action.payload
    },
  }
})

export const {
  setSize,
  setScale,
  setAreAreasVisible,
  setAreProcessedWordsVisible,
  setAreTranslatedWordsVisible,
  setAreLinkAreaContextsVisible,
  setIsDrawingArea,
  setStartingContextConnectionPoint,
} = stageSlice.actions

export default stageSlice.reducer
