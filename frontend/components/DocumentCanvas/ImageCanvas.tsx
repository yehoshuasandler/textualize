'use client'

import React, { useEffect, useRef } from 'react'
import loadImage from '../../useCases/loadImage'

type Props = {
  zoomLevel: number,
  imagePath?: string,
  setSize: (size: { width: number, height: number }) => void
}

const ImageCanvas = (props: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const { imagePath, zoomLevel, setSize } = props

  const applyImageToCanvas = async (path: string) => {
    const canvasContext = canvas.current!.getContext('2d')!

    let image: HTMLImageElement
    try {
      image = await loadImage(path)
    } catch (err) {
      return
    }

    const width = image.naturalWidth * zoomLevel
    const height = image.naturalHeight * zoomLevel

    updateSize({ width, height })

    canvasContext.drawImage(image, 0, 0, width, height)
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
    setSize(size)
  }

  useEffect(() => {
    if (imagePath) applyImageToCanvas(imagePath)
  }, [imagePath, zoomLevel])

  return <canvas className="absolute" ref={canvas} />
}

export default ImageCanvas
