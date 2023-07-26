'use client'

import React from 'react'
import { Group, Line } from 'react-konva'
import { useProject } from '../../../context/Project/provider'
import { useStage } from '../context/provider'

const ConnectionLines = () => {
  const { scale } = useStage()
  const { getSelectedDocument, contextGroups } = useProject()
  const areas = getSelectedDocument()?.areas || []

  const renderLines = () => {
    console.log('contextGroups', contextGroups)
    if (!contextGroups?.length) return <></>

    const linesAlreadyRendered = new Set<string>()
    const lines = contextGroups.map((contextGroup) => {
      const currentArea = areas.find(a => a.id === contextGroup.areaId)
      const nextArea = areas.find(a => a.id === contextGroup.nextId)
      if (!currentArea || !nextArea) return

      if (linesAlreadyRendered.has(`${contextGroup.areaId}-${contextGroup.nextId}`)) return
      if (linesAlreadyRendered.has(`${contextGroup.nextId}-${contextGroup.areaId}`)) return

      const startingPoint = {
        x: ((currentArea.startX + currentArea.endX) * scale) / 2,
        y: currentArea.startY * scale
      }

      const startingTensionPoint = {
        x: (startingPoint.x + (nextArea.startX * scale)) / 2,
        y: startingPoint.y,
      }

      const endingPoint = {
        x: ((nextArea.startX + nextArea.endX) * scale) / 2,
        y: nextArea.endY * scale
      }

      const endingTensionPoint = {
        x: (startingPoint.x + (nextArea.startX * scale)) / 2,
        y: endingPoint.y,
      }

      linesAlreadyRendered.add(`${contextGroup.areaId}-${contextGroup.nextId}`)
      linesAlreadyRendered.add(`${contextGroup.nextId}-${contextGroup.areaId}`)

      return <Line
        key={`${contextGroup.areaId}-${contextGroup.nextId}`}
        points={[
          ...Object.values(startingPoint),
          ...Object.values(startingTensionPoint),
          ...Object.values(endingTensionPoint),
          ...Object.values(endingPoint),
        ]}
        strokeEnabled
        strokeWidth={2 * scale}
        stroke='#dc8dec'
        strokeScaleEnabled={false}
        shadowForStrokeEnabled={false}
        tension={0.2}
      />
    })
    return lines.filter(l => !!l)
  }

  return <Group>{renderLines()}</Group>
}

export default ConnectionLines
