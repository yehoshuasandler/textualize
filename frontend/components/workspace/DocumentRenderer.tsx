'use client'

import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef, useState, WheelEvent } from 'react'
import { useProject } from '../../context/Project/provider'
import loadImage from '../../useCases/loadImage'
import processImageArea from '../../useCases/processImageArea'
import classNames from '../../utils/classNames'
import LanguageSelect from './LanguageSelect'
import isInBounds from '../../utils/isInBounds'
import { ipc } from '../../wailsjs/wailsjs/go/models'

const zoomStep = 0.025
const maxZoomLevel = 4

const DocumentRenderer = () => {
  const { getSelectedDocument, requestAddArea, selectedAreaId, setSelectedAreaId, getProcessedAreasByDocumentId } = useProject()
  const selectedDocument = getSelectedDocument()
  const areas = selectedDocument?.areas
  const documentCanvas = useRef<HTMLCanvasElement>(null)
  const areaCanvas = useRef<HTMLCanvasElement>(null)
  const uiCanvas = useRef<HTMLCanvasElement>(null)
  const drawingCanvas = useRef<HTMLCanvasElement>(null)

  const [zoomLevel, setZoomLevel] = useState(1)
  const [hoverOverAreaId, setHoverOverAreaId] = useState('')
  const [hoveredProcessedArea, setHoveredProcessedArea] = useState<ipc.ProcessedArea | undefined>()

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

    const uiCanvasInstance = uiCanvas.current
    if (!uiCanvasInstance) return
    uiCanvasInstance.width = size.width
    uiCanvasInstance.height = size.height

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
    applyUiCanvasUpdates()
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

  const applyUiCanvasUpdates = () => {
    const uiCanvasInstance = uiCanvas.current
    if (!uiCanvasInstance) return
    const context = uiCanvasInstance.getContext('2d')!
    if (!context) return

    context.clearRect(0, 0, uiCanvasInstance.width, uiCanvasInstance.height)

    if (!areas || !areas.length) return

    const hoverArea = areas.find(a => a.id === hoverOverAreaId)
    if (!hoverArea) return

    context.beginPath()
    context.setLineDash([])
    context.lineWidth = 6
    context.strokeStyle = '#dc8dec'
    const width = (hoverArea.endX - hoverArea.startX) * zoomLevel
    const height = (hoverArea.endY - hoverArea.startY) * zoomLevel
    const x = hoverArea.startX * zoomLevel
    const y = hoverArea.startY * zoomLevel
    context.roundRect(x, y, width, height, 4)
    context.stroke()
    context.closePath()
  }

  const getProcessedAreaById = async (areaId: string) => {
    if (!selectedDocument || !selectedDocument.id || !areaId) return
    const processedAreas = await getProcessedAreasByDocumentId(selectedDocument.id)
    const foundProcessedArea = processedAreas.find(a => a.id === areaId)
    return foundProcessedArea
  }

  const handleHoverOverArea = (e: React.MouseEvent) => {
    const domRect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - domRect.left
    const y = e.clientY - domRect.top
    const point = { x, y }

    const areaContainingCoords = areas?.find(a => {
      const bounds = { startX: a.startX, startY: a.startY, endX: a.endX, endY: a.endY }
      return isInBounds(point, bounds, zoomLevel)
    })

    if (areaContainingCoords?.id === hoverOverAreaId) return

    setHoverOverAreaId(areaContainingCoords?.id || '')
    getProcessedAreaById(areaContainingCoords?.id || '').then(response => {
      console.log(response)
      setHoveredProcessedArea(response)
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
    let mouseX = e.nativeEvent.offsetX
    let mouseY = e.nativeEvent.offsetY

    if (!isMouseDown) handleHoverOverArea(e)
    else {
      const drawingCanvasInstance = drawingCanvas.current
      if (!drawingCanvasInstance) return
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

  useEffect(() => {
    applyUiCanvasUpdates()
  }, [hoverOverAreaId])

  const renderAreaPreview = () => {
    if (!areas || !areas.length || !hoveredProcessedArea) return <></>

    const hoverArea = areas.find(a => a.id === hoverOverAreaId)
    if (!hoverArea) return <></>


    return <div>
      {
        hoveredProcessedArea.lines?.map(l => l.words).flat().map((w, i) => {
          const width = Math.floor((w.boundingBox.x1 - w.boundingBox.x0) * zoomLevel) + 2
          const height = Math.floor((w.boundingBox.y1 - w.boundingBox.y0) * zoomLevel) + 2
          return <span
            key={i}
            dir={w.direction === 'RIGHT_TO_LEFT' ? 'rtl' : 'ltr'}
            className='absolute text-center inline-block p-1 bg-opacity-60 bg-black text-white rounded-md shadow-zinc-900 shadow-2xl'
            style={{
              fontSize: `${3.4 * zoomLevel}vmin`,
              width,
              top: Math.floor(w.boundingBox.y0 * zoomLevel) + height,
              left: Math.floor(w.boundingBox.x0 * zoomLevel)
            }}>
            {w.fullText}
          </span>
        })
      }
    </div>
  }

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
        'w-[calc(100vw-320px)] h-[calc(100vh-174px)] border-4',
        'border-dashed border-gray-200')}>
      <canvas
        className="absolute"
        ref={documentCanvas}
      />
      <canvas
        className="absolute"
        ref={areaCanvas}
      />
      <canvas
        className="absolute"
        ref={uiCanvas}
      />
      <canvas
        className="absolute"
        ref={drawingCanvas}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      {renderAreaPreview()}
    </div>
  </div >
}

export default DocumentRenderer
