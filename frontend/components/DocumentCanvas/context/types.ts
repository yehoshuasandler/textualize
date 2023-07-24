export type StartingContextConnection = {
  isHead: boolean,
  areaId: string,
}

export type StageContextType = {
  scale: number,
  maxScale: number,
  scaleStep: number,
  setScale: (value: number) => void,
  isAreasVisible: boolean,
  setIsAreasVisible: (value: boolean) => void,
  isProcessedWordsVisible: boolean,
  setIsProcessedWordsVisible: (value: boolean) => void,
  isTranslatedWordsVisible: boolean,
  setIsTranslatedWordsVisible: (value: boolean) => void,
  isLinkAreaContextsVisible: boolean,
  setIsLinkAreaContextsVisible: (value: boolean) => void,
  size: { width: number, height: number }
  setSize: (size: {width: number, height: number}) => void,
  isDrawingArea: boolean,
  setIsDrawingArea: (value: boolean) => void,
  startingContextConnection: StartingContextConnection | null,
  setStartingContextConnection: (value: StartingContextConnection | null) => void,
}