export type ContextConnectionPoint = {
  isHead: boolean,
  areaId: string,
}

export type StageState = {
  size: { width: number, height: number },
  scale: number,
  areAreasVisible: boolean,
  areProcessedWordsVisible: boolean,
  areTranslatedWordsVisible: boolean,
  areLinkAreaContextsVisible: boolean,
  isDrawingArea: boolean,
  startingContextConnectionPoint: ContextConnectionPoint | null
}
