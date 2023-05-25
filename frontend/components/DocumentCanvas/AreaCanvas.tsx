'use client'

import React, { useEffect, useRef } from 'react'
import { useProject } from '../../context/Project/provider'

type Props = {
  width: number,
  height: number
  zoomLevel: number
}


const AreaCanvas = (props: Props) => {
  const { getSelectedDocument, selectedAreaId, } = useProject()
  const canvas = useRef<HTMLCanvasElement>(null)

  const areas = getSelectedDocument()?.areas
  const { width, height, zoomLevel } = props


  const applyAreasToCanvas = (zoomLevel: number) => {
    if (!areas || !areas.length) return

    const canvasContext = canvas.current!.getContext('2d')!

    areas.forEach(a => {
      canvasContext.beginPath()
      if (a.id !== selectedAreaId) {
        canvasContext.setLineDash([4])
        canvasContext.lineWidth = 2
        canvasContext.strokeStyle = '#010101'
      } else {
        canvasContext.setLineDash([])
        canvasContext.lineWidth = 3
        canvasContext.strokeStyle = '#dc8dec'
      }
      const width = (a.endX - a.startX) * zoomLevel
      const height = (a.endY - a.startY) * zoomLevel
      const x = a.startX * zoomLevel
      const y = a.startY * zoomLevel
      canvasContext.roundRect(x, y, width, height, 4)
      canvasContext.stroke()
      canvasContext.closePath()
    })
  }

  const clearCanvas = () => {
    const canvasInstance = canvas.current!
    const context = canvasInstance.getContext('2d')!
    context.clearRect(0, 0, canvasInstance.width, canvasInstance.height)
  }

  const updateSize = (size: { width: number, height: number }) => {
    const canvasInstance = canvas.current!
    const { width, height } = size
    canvasInstance.width = width
    canvasInstance.height = height
  }

  useEffect(() => {
    clearCanvas()
    updateSize({ width, height })
    applyAreasToCanvas(zoomLevel)
  }, [width, height, zoomLevel, areas])

  return <canvas className="absolute" ref={canvas} />
}

export default AreaCanvas
