'use client'

import React, { useEffect, useRef } from 'react'
import { useProject } from '../../context/Project/provider'
import loadImage from '../../useCases/loadImage'
import processImageArea from '../../useCases/processImageArea'
import LanguageSelect from './LanguageSelect'

const DocumentRenderer = () => {
  const { getSelectedDocument, requestAddArea } = useProject()
  const selectedDocument = getSelectedDocument()
  const areas = selectedDocument?.areas
  const documentCanvas = useRef<HTMLCanvasElement>(null)
  const areaCanvas = useRef<HTMLCanvasElement>(null)
  const drawingCanvas = useRef<HTMLCanvasElement>(null)

  let downClickX = 0
  let downClickY = 0
  let isMouseDown = false

  const applyCanvasSizes = (size: { width: number, height: number }) => {
    const documentCanvasInstance = documentCanvas.current
    if (!documentCanvasInstance) return
    documentCanvasInstance.width = size.width
    documentCanvasInstance.height = size.height

    const areaCanvasInstance = areaCanvas.current
    if (!areaCanvasInstance) return
    areaCanvasInstance.width = size.width
    areaCanvasInstance.height = size.height

    const drawingCanvasInstance = drawingCanvas.current
    if (!drawingCanvasInstance) return
    drawingCanvasInstance.width = size.width
    drawingCanvasInstance.height = size.height
  }

  const applyDocumentToCanvas = async (path: string) => {
    let image: HTMLImageElement
    try {
      image = await loadImage(path)
    } catch (err) {
      return
    }

    applyCanvasSizes({ width: image.naturalWidth, height: image.naturalHeight })

    const documentCanvasInstance = documentCanvas.current
    if (!documentCanvasInstance) return

    const context = documentCanvasInstance.getContext('2d')
    if (!context) return
    context.drawImage(image, 0, 0, image.width, image.height)

    if (areas) applyAreasToCanvas()
  }

  const applyAreasToCanvas = () => {
    const areaCanvasInstance = areaCanvas.current
    if (!areaCanvasInstance) return
    const context = areaCanvasInstance.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, areaCanvasInstance.width, areaCanvasInstance.height)

    if (!areas || !areas.length) return

    areas.forEach(a => {
      const width = a.endX - a.startX
      const height = a.endY - a.startY
      const x = a.startX
      const y = a.startY
      context.rect(x, y, width, height)
      context.lineWidth = 2
      context.strokeStyle = '#dc8dec'
      context.stroke()
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const drawingCanvasInstance = drawingCanvas.current
    if (!drawingCanvasInstance) return

    downClickX = e.nativeEvent.offsetX
    downClickY = e.nativeEvent.offsetY
    isMouseDown = true
  }

  const handleMouseUp = async (e: React.MouseEvent) => {
    const drawingCanvasInstance = drawingCanvas.current
    if (!drawingCanvasInstance) return

    const mouseX = e.nativeEvent.offsetX
    const mouseY = e.nativeEvent.offsetY

    let startX: number, endX: number
    if (downClickX < mouseX) {
      startX = downClickX
      endX = mouseX
    } else {
      startX = mouseX
      endX = downClickX
    }

    let startY: number, endY: number
    if (downClickY < mouseY) {
      startY = downClickY
      endY = mouseY
    } else {
      startY = mouseY
      endY = downClickY
    }

    if (selectedDocument?.id) {
      const addedArea = await requestAddArea(selectedDocument.id, { startX, startY, endX, endY })
      processImageArea(selectedDocument.id, addedArea)
    }

    const context = drawingCanvasInstance.getContext('2d')
    context?.clearRect(0, 0, drawingCanvasInstance.width, drawingCanvasInstance.height)
    isMouseDown = false
    downClickX = 0
    downClickY = 0
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const drawingCanvasInstance = drawingCanvas.current
    if (!drawingCanvasInstance) return

    let mouseX = e.nativeEvent.offsetX
    let mouseY = e.nativeEvent.offsetY

    if (isMouseDown) {
      const context = drawingCanvasInstance.getContext('2d')
      if (!context) return

      context.clearRect(0, 0, drawingCanvasInstance.width, drawingCanvasInstance.height)
      context.beginPath()
      const width = mouseX - downClickX
      const height = mouseY - downClickY
      context.rect(downClickX, downClickY, width, height)
      context.strokeStyle = '#000'
      context.lineWidth = 2
      context.stroke()
    }
  }

  useEffect(() => {
    if (selectedDocument?.path) applyDocumentToCanvas(selectedDocument.path)
    applyAreasToCanvas()
  })

  return <div className='relative'>
    <div className='flex justify-between mt-2'>
      <h1 className="text-2xl font-semibold text-gray-900">
        {getSelectedDocument()?.name}
      </h1>
      <LanguageSelect shouldUpdateDocument defaultLanguage={selectedDocument?.defaultLanguage} />
    </div>
    <div className="relative mt-2">
      <canvas
        className="absolute border-4 border-dashed border-gray-200"
        ref={documentCanvas}
      />
      <canvas
        className="absolute border-4 border-transparent"
        ref={areaCanvas}
      />
      <canvas
        className="absolute border-4 border-transparent"
        ref={drawingCanvas}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </div>
  </div>
}

export default DocumentRenderer
