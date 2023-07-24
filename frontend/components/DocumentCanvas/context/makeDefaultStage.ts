import { StageContextType } from './types'

const makeDefaultStage = (): StageContextType => ({
  scale: 1,
  maxScale: 4,
  scaleStep: 0.01,
  setScale: (_) => {},
  isAreasVisible: true,
  setIsAreasVisible: (_) => {},
  isProcessedWordsVisible: true,
  setIsProcessedWordsVisible: (_) => {},
  isTranslatedWordsVisible: true,
  setIsTranslatedWordsVisible: (_) => {},
  isLinkAreaContextsVisible: false,
  setIsLinkAreaContextsVisible: (_) => {},
  size: { width: 1, height: 1 },
  setSize: (_) => {},
  isDrawingArea: false,
  setIsDrawingArea: (_) => {},
  startingContextConnection: null,
  setStartingContextConnection: (_) => {},
})

export default makeDefaultStage
