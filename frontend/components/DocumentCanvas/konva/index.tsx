'use client'

import React, { useRef, useState } from 'react'
import { Stage, Layer, Image, } from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'
import Areas from './Areas'
import { useProject } from '../../../context/Project/provider'
import useImage from 'use-image'
import { RectangleCoordinates } from '../types'
import DrawingArea from './DrawingArea'
import getNormalizedRectToBounds from '../../../utils/getNormalizedRectToBounds'
import processImageArea from '../../../useCases/processImageArea'

type Props = {
  scale: number,
  scaleStep: number,
  maxScale: number,
  setScale: Function,
  size: { width: number, height: number }
}

let downClickX: number
let downClickY: number
let isDrawing = false

const KonvaTest = ({ scale, scaleStep, maxScale, setScale, size }: Props) => {
  const { getSelectedDocument, requestAddArea, setSelectedAreaId } = useProject()
  const [documentImage] = useImage(getSelectedDocument()?.path || '')
  const documentRef = useRef(null)
  const [drawingAreaRect, setDrawingAreaRect] = useState<RectangleCoordinates | null>(null)

  const documentWidth = documentImage?.naturalWidth || 0
  const documentHeight = documentImage?.naturalHeight || 0

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (!e.evt.shiftKey) return e.currentTarget.startDrag()

    const position = e.currentTarget.getRelativePointerPosition()
    downClickX = position.x
    downClickY = position.y
    isDrawing = true
  }

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const currentPosition = e.currentTarget.getRelativePointerPosition()
    if (isDrawing) return setDrawingAreaRect({
      startX: downClickX,
      startY: downClickY,
      endX: currentPosition.x,
      endY: currentPosition.y,
    })
  }

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.currentTarget
    if (stage.isDragging()) stage.stopDrag()
    if (isDrawing) isDrawing = false

    if (!drawingAreaRect) return

    const normalizedDrawnRect = getNormalizedRectToBounds(drawingAreaRect, documentWidth, documentHeight, scale)
    const selectedDocumentId = getSelectedDocument()!.id
    requestAddArea(selectedDocumentId, normalizedDrawnRect).then(addedArea => {
      setSelectedAreaId(addedArea.id)
      processImageArea(selectedDocumentId, addedArea.id)
    })

    setDrawingAreaRect(null)
  }

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    if (!e.evt.ctrlKey) return

    const wheelDelta = e.evt.deltaY

    const shouldAttemptScaleUp = (wheelDelta < 0) && scale < maxScale
    if (shouldAttemptScaleUp) setScale(scale + scaleStep)
    else if (scale > (scaleStep * 2)) setScale(scale - scaleStep)
  }

  return <Stage width={size.width} height={size.height} scale={{ x: scale, y: scale }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onWheel={handleWheel}>
    <Layer id='documentLayer'>
      <Image alt='Document Image'
        ref={documentRef}
        image={documentImage}
        width={documentWidth}
        height={documentHeight}
        scale={{ x: scale, y: scale }}
        shadowEnabled
        shadowColor='black'
        shadowOpacity={0.3}
        shadowBlur={documentWidth * 0.05}
        listening={false}
      />
      {(isDrawing && drawingAreaRect) ? <DrawingArea rect={drawingAreaRect} /> : <></>}
    </Layer>
    <Layer>
      <Areas scale={scale} />
    </Layer>
  </Stage>
}

export default KonvaTest
