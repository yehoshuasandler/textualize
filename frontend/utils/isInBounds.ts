type Point = { x: number, y: number }
type Bounds = { startX: number, startY: number, endX: number, endY: number }

const isInBounds = (point: Point, bounds: Bounds, rectOffsetMultiplier: number = 1) => {
  const { x, y } = point
  const { startX, startY, endX, endY } = bounds

  const isInBoundsX = (x >= startX * rectOffsetMultiplier) && x <= endX * rectOffsetMultiplier
  const isInBoundsY = (y >= startY * rectOffsetMultiplier) && y <= endY * rectOffsetMultiplier
  return isInBoundsX && isInBoundsY
}

export default isInBounds
