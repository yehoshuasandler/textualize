'use client'

import React, { WheelEvent, useEffect, useRef, useState } from 'react'
import { useProject } from '../../context/Project/provider'
import { ipc } from '../../wailsjs/wailsjs/go/models'
import createUiCanvasInteractions from './createUiCanvasInteractions'
import processImageArea from '../../useCases/processImageArea'
import AreaTextPreview from './AreaTextPreview'
import EditProcessedWord from './EditProcessedWord'

type Props = {
  width: number,
  height: number
  zoomDetails: { currentZoomLevel: number, zoomStep: number, maxZoomLevel: number }
  setZoomLevel: (value: number) => void
}

let interactions: ReturnType<typeof createUiCanvasInteractions> | null = null

let downClickX = 0
let downClickY = 0
let isDrawing = false

const UiCanvas = (props: Props) => {
  const {
    getSelectedDocument,
    getProcessedAreaById,
    requestAddArea,
    setSelectedAreaId,
  } = useProject()
  const canvas = useRef<HTMLCanvasElement>(null)
  const [hoverOverAreaId, setHoverOverAreaId] = useState('')
  const [wordToEdit, setWordToEdit] = useState<{ word: ipc.ProcessedWord, areaId: string } | undefined>()
  const [hoveredProcessedArea, setHoveredProcessedArea] = useState<ipc.ProcessedArea | undefined>()

  const areas = getSelectedDocument()?.areas || []
  const { width, height, zoomDetails, setZoomLevel } = props
  const { currentZoomLevel } = zoomDetails

  const applyUiCanvasUpdates = () => {
    const canvasContext = canvas.current!.getContext('2d')!

    if (!areas || !areas.length) return

    const hoverArea = areas.find(a => a.id === hoverOverAreaId)
    if (!hoverArea) return

    canvasContext.beginPath()
    canvasContext.setLineDash([])
    canvasContext.lineWidth = 6
    canvasContext.strokeStyle = '#dc8dec'
    const width = (hoverArea.endX - hoverArea.startX) * currentZoomLevel
    const height = (hoverArea.endY - hoverArea.startY) * currentZoomLevel
    const x = hoverArea.startX * currentZoomLevel
    const y = hoverArea.startY * currentZoomLevel
    canvasContext.roundRect(x, y, width, height, 4)
    canvasContext.stroke()
    canvasContext.closePath()
  }

  const clearCanvas = () => {
    const canvasInstance = canvas.current!
    const context = canvasInstance.getContext('2d')!
    context.clearRect(0, 0, canvasInstance.width, canvasInstance.height)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.nativeEvent.shiftKey) {
      downClickX = e.nativeEvent.offsetX
      downClickY = e.nativeEvent.offsetY
      isDrawing = true
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) interactions?.onActivelyDrawArea({
      startX: downClickX,
      startY: downClickY,
      endX: e.nativeEvent.offsetX,
      endY: e.nativeEvent.offsetY,
    })
    else interactions?.onHoverOverArea(
      e.clientX,
      e.clientY,
      currentZoomLevel,
      areas,
      (areaId) => {
        if (areaId === hoverOverAreaId) return

        setHoverOverAreaId(areaId || '')
        getProcessedAreaById(areaId || '').then(response => {
          setHoveredProcessedArea(response)
        })
      }
    )
  }

  const handleMouseUp = async (e: React.MouseEvent) => {
    if (isDrawing) {
      const coordinates = {
        startMouseX: downClickX,
        startMouseY: downClickY,
        endMouseX: e.nativeEvent.offsetX,
        endMouseY: e.nativeEvent.offsetY,
      }
      interactions?.onFinishDrawArea(coordinates, currentZoomLevel,
        async (startX, startY, endX, endY) => {
          const canvasInstance = canvas.current
          if (!canvasInstance) return

          const selectedDocumentId = getSelectedDocument()?.id
          if (selectedDocumentId) {
            const addedArea = await requestAddArea(selectedDocumentId, { startX, startY, endX, endY })
            setSelectedAreaId(addedArea.id)
            processImageArea(selectedDocumentId, addedArea.id)
          }

          const context = canvasInstance.getContext('2d')
          context?.clearRect(0, 0, canvasInstance.width, canvasInstance.height)
          isDrawing = false
          downClickX = 0
          downClickY = 0
        }
      )
    }
  }

  const handleWheelEvent = (e: WheelEvent<HTMLCanvasElement>) => {
    if (e.ctrlKey) interactions?.onZoom(e.deltaY, zoomDetails, setZoomLevel)
  }

  const updateSize = (size: { width: number, height: number }) => {
    const canvasInstance = canvas.current!
    const { width, height } = size
    canvasInstance.width = width
    canvasInstance.height = height
  }


  useEffect(() => {
    if (!interactions && canvas.current) {
      interactions = createUiCanvasInteractions(canvas.current)
    }
  }, [canvas.current])

  useEffect(() => {
    clearCanvas()
    updateSize({ width, height })
    applyUiCanvasUpdates()
  }, [width, height, currentZoomLevel, areas])


  useEffect(() => {
    clearCanvas()
    applyUiCanvasUpdates()
  }, [hoverOverAreaId])


  return <>
    <canvas
      className="absolute"
      ref={canvas}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheelEvent}
    />
    <AreaTextPreview
      setWordToEdit={setWordToEdit}
      processedArea={hoveredProcessedArea}
      zoomLevel={currentZoomLevel}
      areas={areas}
    />

    <EditProcessedWord
      zoomLevel={currentZoomLevel}
      processedArea={hoveredProcessedArea}
      wordToEdit={wordToEdit?.word}
      setWordToEdit={setWordToEdit}
      setHoveredProcessedArea={setHoveredProcessedArea}
    />
  </>

}

export default UiCanvas
