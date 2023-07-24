'use client'

import React from 'react'
import { Line } from 'react-konva'
import { StartingContextConnection } from '../context/types'
import { entities } from '../../../wailsjs/wailsjs/go/models'
import { Coordinates } from '../types'

type CurrentDrawingConnectionProps = {
  startingContextConnection: StartingContextConnection | null
  areas: entities.Area[],
  scale: number,
  endDrawingPosition: Coordinates | null
}
const CurrentDrawingConnection = (props: CurrentDrawingConnectionProps) => {
  const { startingContextConnection, areas, scale, endDrawingPosition } = props 
  if (!startingContextConnection || !endDrawingPosition) return <></>

  const { areaId, isHead } = startingContextConnection

  const area = areas.find(a => a.id === areaId)
  if (!area) return <></>

  const startingPoint = {
    x: ((area.startX + area.endX) * scale) / 2,
    y: (isHead ? area.startY : area.endY) * scale
  }

  const startingTensionPoint = {
    x: (startingPoint.x + endDrawingPosition.x) / 2,
    y: startingPoint.y,
  }

  const endingTensionPoint = {
    x: (startingPoint.x + endDrawingPosition.x) / 2,
    y: endDrawingPosition.y,
  }

  return <Line
    points={[
      ...Object.values(startingPoint),
      ...Object.values(startingTensionPoint),
      ...Object.values(endingTensionPoint),
      ...Object.values(endDrawingPosition),
    ]}
    strokeEnabled
    strokeWidth={2 * scale}
    stroke='#dc8dec'
    strokeScaleEnabled={false}
    shadowForStrokeEnabled={false}
    tension={0.2}
  />
}

export default CurrentDrawingConnection
