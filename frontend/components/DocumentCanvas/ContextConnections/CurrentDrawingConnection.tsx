'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { Line } from 'react-konva'
import { Coordinates } from '../types'
import { useProject } from '../../../context/Project/provider'
import { RootState } from '../../../redux/store'

type CurrentDrawingConnectionProps = {
  endDrawingPosition: Coordinates | null
}
const CurrentDrawingConnection = (props: CurrentDrawingConnectionProps) => {
  const { scale, startingContextConnectionPoint } = useSelector((state: RootState) => state.stage)
  const { endDrawingPosition } = props 
  const { getSelectedDocument } = useProject()
  const areas = getSelectedDocument()?.areas || []

  if (!startingContextConnectionPoint || !endDrawingPosition) return <></>

  const { areaId, isHead } = startingContextConnectionPoint

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
    listening={false}
  />
}

export default CurrentDrawingConnection
