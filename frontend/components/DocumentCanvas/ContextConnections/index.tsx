'use client'

import React, { useEffect, useState } from 'react'
import { Group } from 'react-konva'
import { useStage } from '../context/provider'
import { useProject } from '../../../context/Project/provider'
import Konva from 'konva'
import { Coordinates } from '../types'
import CurrentDrawingConnection from './CurrentDrawingConnection'
import ConnectionPoints from './ConnectionPoints'
import ConnectionLines from './ConnectionLines'

const ContextConnections = () => {
  const { getSelectedDocument } = useProject()
  const { isLinkAreaContextsVisible, startingContextConnection, scale } = useStage()
  const areas = getSelectedDocument()?.areas || []

  const [endDrawingPosition, setEndDrawingPosition] = useState<Coordinates | null>(null)

  const handleMouseMove = (e: MouseEvent) => {
    if (!isLinkAreaContextsVisible || !startingContextConnection) return
    setEndDrawingPosition(Konva.stages[0].getRelativePointerPosition())
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  })

  useEffect(() => {
    if (!startingContextConnection) setEndDrawingPosition(null)
  }, [startingContextConnection])

  if (!isLinkAreaContextsVisible) return <></>

  return <Group>
    <ConnectionPoints areas={areas} />
    <ConnectionLines />
    <CurrentDrawingConnection endDrawingPosition={endDrawingPosition} />
  </Group>
}

export default ContextConnections