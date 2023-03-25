'use client'

import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef, useState, WheelEvent } from 'react'
import { useProject } from '../../context/Project/provider'
import loadImage from '../../useCases/loadImage'
import processImageArea from '../../useCases/processImageArea'
import classNames from '../../utils/classNames'
import LanguageSelect from './LanguageSelect'

const zoomStep = 0.05
const maxZoomLevel = 4

const DocumentRenderer = () => {
  const { getSelectedDocument, requestAddArea, selectedAreaId, setSelectedAreaId } = useProject()
  const selectedDocument = getSelectedDocument()
  const areas = selectedDocument?.areas
  const documentCanvas = useRef<HTMLCanvasElement>(null)
  const areaCanvas = useRef<HTMLCanvasElement>(null)
  const drawingCanvas = useRef<HTMLCanvasElement>(null)

  const [zoomLevel, setZoomLevel] = useState(1)

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

    const width = image.naturalWidth * zoomLevel
    const height = image.naturalHeight * zoomLevel

    applyCanvasSizes({ width, height })

    const documentCanvasInstance = documentCanvas.current
    if (!documentCanvasInstance) return

    const context = documentCanvasInstance.getContext('2d')
    if (!context) return
    context.drawImage(image, 0, 0, width, height)

    if (areas) applyAreasToCanvas()
  }

  const applyAreasToCanvas = () => {
    const areaCanvasInstance = areaCanvas.current
    if (!areaCanvasInstance) return
    const context = areaCanvasInstance.getContext('2d')!
    if (!context) return

    context.clearRect(0, 0, areaCanvasInstance.width, areaCanvasInstance.height)

    if (!areas || !areas.length) return

    areas.forEach(a => {
      context.beginPath()
      if (a.id !== selectedAreaId) {
        context.setLineDash([4])
        context.lineWidth = 2
        context.strokeStyle = '#010101'
      } else {
        context.setLineDash([])
        context.lineWidth = 3
        context.strokeStyle = '#dc8dec'
      }
      const width = (a.endX - a.startX) * zoomLevel
      const height = (a.endY - a.startY) * zoomLevel
      const x = a.startX * zoomLevel
      const y = a.startY * zoomLevel
      context.roundRect(x, y, width, height, 4)
      context.stroke()
      context.closePath()
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
      startX = Math.floor(downClickX / zoomLevel)
      endX = Math.floor(mouseX / zoomLevel)
    } else {
      startX = Math.floor(mouseX / zoomLevel)
      endX = Math.floor(downClickX / zoomLevel)
    }

    let startY: number, endY: number
    if (downClickY < mouseY) {
      startY = Math.floor(downClickY / zoomLevel)
      endY = Math.floor(mouseY / zoomLevel)
    } else {
      startY = Math.floor(mouseY / zoomLevel)
      endY = Math.floor(downClickY / zoomLevel)
    }

    if (selectedDocument?.id) {
      const addedArea = await requestAddArea(selectedDocument.id, { startX, startY, endX, endY })
      setSelectedAreaId(addedArea.id)
      processImageArea(selectedDocument.id, addedArea.id)
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

  const handleWheelEvent = (e: WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) return

    const shouldAttemptToZoomIn = (e.deltaY < 0) && zoomLevel < maxZoomLevel
    if (shouldAttemptToZoomIn) setZoomLevel(zoomLevel + zoomStep)
    else if (zoomLevel > (zoomStep * 2)) setZoomLevel(zoomLevel - zoomStep)
  }

  useEffect(() => {
    if (selectedDocument?.path) applyDocumentToCanvas(selectedDocument.path)
  })

  return <div className='relative'>
    <div className='flex justify-between align-top mb-2'>
      <div className='flex align-top'>
        <h1 className="text-xl font-semibold text-gray-900 inline-block mr-2">{getSelectedDocument()?.name}</h1>
        <LanguageSelect shouldUpdateDocument defaultLanguage={selectedDocument?.defaultLanguage} />
      </div>
      <div className='flex justify-evenly items-center'>
        <MagnifyingGlassMinusIcon className='w-4 h-4' />
        <input
          id="zoomRange" type="range" min={zoomStep} max={maxZoomLevel} step={zoomStep}
          value={zoomLevel} className="w-[calc(100%-50px)] h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer p-0"
          onChange={(e) => { setZoomLevel(e.currentTarget.valueAsNumber) }}
        />
        <MagnifyingGlassPlusIcon className='w-4 h-4' />
      </div>
    </div>
    <div
      onWheelCapture={handleWheelEvent}
      className={classNames('relative mt-2 overflow-scroll',
        'w-[calc(100vw-320px)] h-[calc(100vh-240px)] border-4',
        'border-dashed border-gray-200')}>
      <canvas
        className="absolute"
        ref={documentCanvas}
      />
      <canvas
        className="absolute "
        ref={areaCanvas}
      />
      <canvas
        className="absolute"
        ref={drawingCanvas}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </div>
  </div >
}

export default DocumentRenderer
