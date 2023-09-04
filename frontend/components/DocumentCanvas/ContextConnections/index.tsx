'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Group } from 'react-konva'
import { useProject } from '../../../context/Project/provider'
import Konva from 'konva'
import { Coordinates } from '../types'
import CurrentDrawingConnection from './CurrentDrawingConnection'
import ConnectionPoints from './ConnectionPoints'
import ConnectionLines from './ConnectionLines'
import { RootState } from '../../../redux/store'

const ContextConnections = () => {
  const { startingContextConnectionPoint, areLinkAreaContextsVisible } = useSelector((state: RootState) => state.stage)

  const { getSelectedDocument } = useProject()
  const areas = getSelectedDocument()?.areas || []

  const [endDrawingPosition, setEndDrawingPosition] = useState<Coordinates | null>(null)

  const handleMouseMove = (e: MouseEvent) => {
    if (!areLinkAreaContextsVisible || !startingContextConnectionPoint) return
    setEndDrawingPosition(Konva.stages[0].getRelativePointerPosition())
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  })

  useEffect(() => {
    if (!startingContextConnectionPoint) setEndDrawingPosition(null)
  }, [startingContextConnectionPoint])

  if (!areLinkAreaContextsVisible) return <></>

  return <Group>
    <ConnectionPoints areas={areas} />
    <ConnectionLines />
    <CurrentDrawingConnection endDrawingPosition={endDrawingPosition} />
  </Group>
}

export default ContextConnections