export type MouseCoordinates = {
  startMouseX: number, startMouseY: number, endMouseX: number, endMouseY: number
}

export type RectangleCoordinates = {
  startX: number, startY: number, endX: number, endY: number
}

export type AddAreaToStoreCallback = (startX: number, startY: number, endX: number, endY: number) => Promise<void>

export type SetZoomCallback = (newZoomLevel: number) => void

export type ZoomDetails = {
  currentZoomLevel: number,
  maxZoomLevel: number,
  zoomStep: number
}

export type HoverOverAreaCallback = (areaId?: string) => void