import isInBounds from '../../utils/isInBounds'
import { ipc } from '../../wailsjs/wailsjs/go/models'


type MouseCoordinates = {
  startMouseX: number, startMouseY: number, endMouseX: number, endMouseY: number
}

type RectangleCoordinates = {
  startX: number, startY: number, endX: number, endY: number
}

type AddAreaToStoreCallback =
  (startX: number, startY: number, endX: number, endY: number)
    => Promise<void>

type SetZoomCallback = (newZoomLevel: number) => void

type ZoomDetails = {
  currentZoomLevel: number,
  maxZoomLevel: number,
  zoomStep: number
}

type HoverOverAreaCallback = (areaId?: string) => void

/**
 * @param uiCanvas 
 * @returns Various methods to be called during events on the `UiCanvas`.
 * Dependencies must be injected, such as state change callbacks.
 */
const createUiCanvasInteractions = (uiCanvas: HTMLCanvasElement) => {
  const uiCanvasContext = uiCanvas.getContext('2d')!

  return {
    onActivelyDrawArea: (coordinates: RectangleCoordinates) => {
      const { startX, startY, endX, endY } = coordinates

      uiCanvasContext.clearRect(0, 0, uiCanvas.width, uiCanvas.height)
      uiCanvasContext.beginPath()
      const width = endX - startX
      const height = endY - startY
      uiCanvasContext.rect(startX, startY, width, height)
      uiCanvasContext.strokeStyle = '#000'
      uiCanvasContext.lineWidth = 2
      uiCanvasContext.stroke()
    },
    onFinishDrawArea: (coordinates: MouseCoordinates, zoomLevel: number,  addAreaToStoreCallback: AddAreaToStoreCallback) => {
      let { startMouseX, endMouseX, startMouseY, endMouseY } = coordinates

      let startX: number, endX: number
      if (startMouseX < endMouseX) {
        startX = Math.floor(startMouseX / zoomLevel)
        endX = Math.floor(endMouseX / zoomLevel)
      } else {
        startX = Math.floor(endMouseX / zoomLevel)
        endX = Math.floor(startMouseX / zoomLevel)
      }

      let startY: number, endY: number
      if (startMouseY < endMouseY) {
        startY = Math.floor(startMouseY / zoomLevel)
        endY = Math.floor(endMouseY / zoomLevel)
      } else {
        startY = Math.floor(endMouseY / zoomLevel)
        endY = Math.floor(startMouseY / zoomLevel)
      }

      addAreaToStoreCallback(startX, startY, endX, endY)
    },
    onZoom: (wheelDelta: number, zoomDetails: ZoomDetails, setZoomCallBack: SetZoomCallback) => {
      const { currentZoomLevel, maxZoomLevel, zoomStep } = zoomDetails

      const shouldAttemptToZoomIn = (wheelDelta < 0) && currentZoomLevel < maxZoomLevel
      if (shouldAttemptToZoomIn) setZoomCallBack(currentZoomLevel + zoomStep)
      else if (currentZoomLevel > (zoomStep * 2)) setZoomCallBack(currentZoomLevel - zoomStep)
    },
    onHoverOverArea: (mouseX: number, mouseY: number, zoomLevel: number, areas: ipc.Area[], callback: HoverOverAreaCallback) => {
      if (!areas.length) return

      const domRect = uiCanvas.getBoundingClientRect()
      const x = mouseX - domRect.left
      const y = mouseY - domRect.top
      const point = { x, y }
  
      const areaContainingCoords = areas.find(a => {
        const bounds = {
          startX: a.startX,
          startY: a.startY,
          endX: a.endX,
          endY: a.endY
        }
        return isInBounds(point, bounds, zoomLevel)
      })

      callback(areaContainingCoords?.id)
    },
  }
}

export default createUiCanvasInteractions
