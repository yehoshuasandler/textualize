'use client'

import React from 'react'
import { Rect, } from 'react-konva'
type Props = {
  rect: {
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  },
}

const DrawingArea = (props: Props) => {
  const { rect } = props
  const width = rect.endX - rect.startX
  const height = rect.endY - rect.startY
  return <Rect
    width={width}
    height={height}
    x={rect.startX}
    y={rect.startY}
    strokeEnabled
    stroke='#dc8dec'
    strokeWidth={2}
    strokeScaleEnabled={false}
  />
}

export default DrawingArea
