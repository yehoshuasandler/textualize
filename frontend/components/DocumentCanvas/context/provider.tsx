'use client'

import { createContext, useContext, useState, ReactNode, } from 'react'
import makeDefaultStage from './makeDefaultStage'
import { StageContextType, StartingContextConnection } from './types'

const StageContext = createContext<StageContextType>(makeDefaultStage())

export function useStage() {
  return useContext(StageContext)
}

const maxScale = 4
const scaleStep = 0.01

type Props = { children: ReactNode }
export function StageProvider({ children }: Props) {
  const [size, setSize] = useState({width: 1, height: 1})
  const [scale, setScale] = useState(1)
  const [isAreasVisible, setIsAreasVisible] = useState(true)
  const [isProcessedWordsVisible, setIsProcessedWordsVisible] = useState(true)
  const [isTranslatedWordsVisible, setIsTranslatedWordsVisible] = useState(true)
  const [isLinkAreaContextsVisible, setIsLinkAreaContextsVisible] = useState(false)
  const [isDrawingArea, setIsDrawingArea] = useState(false)
  const [startingContextConnection, setStartingContextConnection] = useState<StartingContextConnection | null>(null)

  const value = {
    scale,
    maxScale,
    scaleStep,
    setScale,
    isAreasVisible,
    setIsAreasVisible,
    isProcessedWordsVisible,
    setIsProcessedWordsVisible,
    isTranslatedWordsVisible,
    setIsTranslatedWordsVisible,
    isLinkAreaContextsVisible,
    setIsLinkAreaContextsVisible,
    size,
    setSize,
    isDrawingArea,
    setIsDrawingArea,
    startingContextConnection,
    setStartingContextConnection,
  }

  return <StageContext.Provider value={value}>
    { children }
  </StageContext.Provider>
}