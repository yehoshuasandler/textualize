import { RectangleCoordinates } from '../components/DocumentCanvas/types'

const getNormalizedRectToBounds = (rect: RectangleCoordinates, width: number, height: number, scale: number = 1): RectangleCoordinates => {
  let startX: number, endX: number
  if (rect.startX < rect.endX) {
    startX = Math.floor(rect.startX / scale)
    endX = Math.floor(rect.endX / scale)
  } else {
    startX = Math.floor(rect.endX / scale)
    endX = Math.floor(rect.startX / scale)
  }

  let startY: number, endY: number
  if (rect.startY < rect.endY) {
    startY = Math.floor(rect.startY / scale)
    endY = Math.floor(rect.endY / scale)
  } else {
    startY = Math.floor(rect.endY / scale)
    endY = Math.floor(rect.startY / scale)
  }

  if (startX < 0) startX = 0
  if (startY < 0) startY = 0
  if (endX > width) endX = width
  if (endY > height) endY = height

  return { startX, startY, endX, endY }
}

export default getNormalizedRectToBounds