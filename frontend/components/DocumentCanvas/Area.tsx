'use client'

import React, { useState } from 'react'
import { Group, Rect } from 'react-konva'
import { entities } from '../../wailsjs/wailsjs/go/models'
import { useProject } from '../../context/Project/provider'
import { KonvaEventObject } from 'konva/lib/Node'
import Konva from 'konva'
import AreaContextMenu from './AreaContextMenu'

type Props = {
  isActive: boolean,
  area: entities.Area,
  scale: number,
  setHoveredOverAreaIds: Function
  setHoveredProcessedArea: Function
}

type coordinates = { x: number, y: number }

const Area = (props: Props) => {
  const { getProcessedAreaById, selectedAreaId, setSelectedAreaId } = useProject()
  const shapeRef = React.useRef<Konva.Rect>(null)
  const [isAreaContextMenuOpen, setIsAreaContextMenuOpen] = useState(false)
  const [areaContextMenuPosition, setAreaContextMenuPosition] = useState<coordinates>()

  const { area, scale, isActive, setHoveredOverAreaIds, setHoveredProcessedArea } = props
  const a = area
  const width = (a.endX - a.startX)
  const height = (a.endY - a.startY)

  const handleEnterOrLeave = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.currentTarget.getStage()!
    const currentMousePosition = stage.pointerPos
    const intersectingNodes = stage.getAllIntersections(currentMousePosition)
    const drawnAreas = intersectingNodes.filter(n => n.attrs?.isArea)
    const drawnAreasIds = drawnAreas.map(d => d.attrs?.id)
    setHoveredOverAreaIds(drawnAreasIds)

    const processedAreaRequests = drawnAreasIds.map(a => getProcessedAreaById(a || ''))
    Promise.all(processedAreaRequests).then(responses => {
      const validResponses = responses.filter(r => r?.id) as entities.ProcessedArea[]
      setHoveredProcessedArea(validResponses || [])
    })
  }

  const handleContextMenu = (e: KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault()
    const stage = e.currentTarget.getStage()
    const pointerPosition = stage?.getRelativePointerPosition()
    if (!pointerPosition) return

    const x = pointerPosition.x + 4
    const y = pointerPosition.y + 4
    setAreaContextMenuPosition({ x, y })
    setIsAreaContextMenuOpen(true)
  }

  const handleAreaClick = (areaId: string) => {
    if (areaId === selectedAreaId) setSelectedAreaId('')
    else setSelectedAreaId(areaId)
  }

  return <Group>
    <Rect
      ref={shapeRef}
      id={a.id}
      width={width}
      height={height}
      x={a.startX * scale}
      y={a.startY * scale}
      scale={{ x: scale, y: scale }}
      strokeEnabled
      stroke={isActive ? '#dc8dec' : '#1e1e1e'}
      strokeWidth={1}
      strokeScaleEnabled={false}
      shadowForStrokeEnabled={false}
      onMouseEnter={handleEnterOrLeave}
      onMouseLeave={handleEnterOrLeave}
      onClick={() => handleAreaClick(a.id)}
      onContextMenu={handleContextMenu}
      isArea />
    {!isAreaContextMenuOpen
      ? <></>
      : <AreaContextMenu
        area={area}
        x={areaContextMenuPosition?.x || 0}
        y={areaContextMenuPosition?.y || 0}
        scale={scale}
        setIsAreaContextMenuOpen={setIsAreaContextMenuOpen} />
    }
  </Group>
}

export default Area