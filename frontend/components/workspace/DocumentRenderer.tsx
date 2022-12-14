'use client'

import { useEffect, useRef } from "react"
import { useProject } from "../../context/Project/provider"


const loadImage = (path: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = path
    image.onload = () => resolve(image)
    image.onerror = (error) => reject(error)
  })
}

const DocumentRenderer = () => {
  const { getSelectedDocument } = useProject()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const applyDocumentToCanvas = async (path: string) => {
    const image = await loadImage(path)

    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    const context = canvas.getContext('2d')
    if (!context) return
    context.drawImage(image, 0, 0, image.width, image.height)
  }

  useEffect(() => {
    const selectedDocument = getSelectedDocument()
    const documentPath = selectedDocument?.path
    if (documentPath) applyDocumentToCanvas(selectedDocument.path)
  }, [getSelectedDocument])

  return (
    <canvas ref={canvasRef}></canvas>
  )
}

export default DocumentRenderer
