'use client'

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Konva from 'konva'
import { Group, Rect } from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { entities } from '../../wailsjs/wailsjs/go/models'
import { useProject } from '../../context/Project/provider'
import AreaContextMenu from './AreaContextMenu'
import { RootState } from '../../redux/store'

type Props = {
  isActive: boolean,
  area: entities.Area,
}

type coordinates = { x: number, y: number }

const Area = (props: Props) => {
  const { scale } = useSelector((state: RootState) => state.stage)
  const { selectedAreaId, setSelectedAreaId } = useProject()
  const shapeRef = React.useRef<Konva.Rect>(null)
  const [isAreaContextMenuOpen, setIsAreaContextMenuOpen] = useState(false)
  const [areaContextMenuPosition, setAreaContextMenuPosition] = useState<coordinates>()

  const { area, isActive } = props
  const a = area
  const width = (a.endX - a.startX)
  const height = (a.endY - a.startY)

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
      onClick={() => handleAreaClick(a.id)}
      onContextMenu={handleContextMenu}
      isArea
    />
    {isAreaContextMenuOpen
      ? <AreaContextMenu
        area={area}
        x={areaContextMenuPosition?.x || 0}
        y={areaContextMenuPosition?.y || 0}
        scale={scale}
        setIsAreaContextMenuOpen={setIsAreaContextMenuOpen} />
      : <></>
    }
  </Group>
}

export default Area