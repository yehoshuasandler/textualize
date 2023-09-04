'use client'

import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Stage, Layer, Image, } from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'
import Areas from './Areas'
import { useProject } from '../../context/Project/provider'
import useImage from 'use-image'
import { RectangleCoordinates } from './types'
import DrawingArea from './DrawingArea'
import getNormalizedRectToBounds from '../../utils/getNormalizedRectToBounds'
import ContextConnections from './ContextConnections'
import processImageRect from '../../useCases/processImageRect'
import { RootState } from '../../redux/store'
import { maxScale, scaleStep, setIsDrawingArea, setScale, setStartingContextConnectionPoint } from '../../redux/features/stage/stageSlice'

let downClickX: number
let downClickY: number

const CanvasStage = () => {
  const dispatch = useDispatch()
  const {
    scale, size,
    isDrawingArea,
    areAreasVisible,
    areLinkAreaContextsVisible,
    startingContextConnectionPoint
  } = useSelector((state: RootState) => state.stage)

  const { getSelectedDocument, updateDocuments, setSelectedAreaId } = useProject()
  const [documentImage] = useImage(getSelectedDocument()?.path || '')
  const documentRef = useRef(null)
  const [drawingAreaRect, setDrawingAreaRect] = useState<RectangleCoordinates | null>(null)

  const documentWidth = documentImage?.naturalWidth || 0
  const documentHeight = documentImage?.naturalHeight || 0

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (startingContextConnectionPoint) return dispatch(setStartingContextConnectionPoint(null)) // TODO: handle if clicking o connect
    if (!e.evt.shiftKey) return e.currentTarget.startDrag()

    const position = e.currentTarget.getRelativePointerPosition()
    downClickX = position.x
    downClickY = position.y
    dispatch(setIsDrawingArea(true))
  }

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const currentPosition = e.currentTarget.getRelativePointerPosition()
    if (isDrawingArea) return setDrawingAreaRect({
      startX: downClickX,
      startY: downClickY,
      endX: currentPosition.x,
      endY: currentPosition.y,
    })
  }

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.currentTarget
    if (stage.isDragging()) stage.stopDrag()
    else if (isDrawingArea) dispatch(setIsDrawingArea(false))

    if (!drawingAreaRect) return

    const normalizedDrawnRect = getNormalizedRectToBounds(drawingAreaRect, documentWidth, documentHeight, scale)
    const selectedDocumentId = getSelectedDocument()!.id
    processImageRect(selectedDocumentId, normalizedDrawnRect).then(async addedAreas => {
      updateDocuments().then(response => {
        if (!addedAreas.length) return
        setSelectedAreaId(addedAreas[0].id)
      })
    })
    setDrawingAreaRect(null)
  }

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    if (!e.evt.ctrlKey) return

    const wheelDelta = e.evt.deltaY

    const shouldAttemptScaleUp = (wheelDelta < 0) && scale < maxScale
    if (shouldAttemptScaleUp) dispatch(setScale(scale + scaleStep))
    else if (scale > (scaleStep * 2)) dispatch(setScale(scale - scaleStep))
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
      {(isDrawingArea && drawingAreaRect) ? <DrawingArea rect={drawingAreaRect} /> : <></>}
    </Layer>
    {areAreasVisible
      ? <Layer id='areaLayer'>
        <Areas scale={scale} />
      </Layer>
      : <></>
    }
    {areAreasVisible && areLinkAreaContextsVisible
      ? <Layer id='contextConnections'>
        <ContextConnections />
      </Layer>
      : <></>
    }
  </Stage>
}

export default CanvasStage
