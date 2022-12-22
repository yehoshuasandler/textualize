import { createScheduler, createWorker } from "tesseract.js"
import { GetDocumentById } from "../wailsjs/wailsjs/go/ipc/Channel"
import { ipc } from "../wailsjs/wailsjs/go/models"
import loadImage from "./loadImage"

const getBase64 = (imageData: ImageData) => {
  const canvasOfSection = document.createElement('canvas')
  canvasOfSection.width = imageData.width
  canvasOfSection.height = imageData.height
  canvasOfSection.getContext('2d')!.putImageData(imageData, 0, 0)
  return canvasOfSection.toDataURL()
}

const getImageContextFromDocument = async (doc: ipc.Document) => {
  const image = await loadImage(doc.path)
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.height

  const context = canvas.getContext('2d')!
  context?.drawImage(image, 0, 0, image.width, image.height)
  return context
}

const getImageWorkerCount = (areaCount: number) => {
  const minWorkerCount = 1
  const maxWorkerCount = 10
  const areasPerWorker = 10

  if (areaCount > maxWorkerCount * areasPerWorker) return maxWorkerCount;
  if (areaCount <= areasPerWorker) return 1

  const workerCount = ~~(areaCount / areasPerWorker)
  return workerCount
}

const getImageData = async (path: string) => {
  const image = await loadImage(path)
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.height

  const context = canvas.getContext('2d')!
  context?.drawImage(image, 0, 0, image.width, image.height)
  return canvas.toDataURL();
}

const processImageData = async (documentId: string) => {
  const foundDocument = await GetDocumentById(documentId)
  if (!foundDocument.path || !foundDocument.areas?.length) return

  const { areas, path } = foundDocument

  const imageData = await loadImage(path)

  const scheduler = createScheduler()

  const workerCount = getImageWorkerCount(areas.length)
  for (let index = 0; index < workerCount; index++) {
    console.log('add worker stuff')
    const worker = await createWorker()
    await worker.loadLanguage('eng') // TODO: change this when multilangiage system is implementd
    await worker.initialize('eng') // TODO: same here
    scheduler.addWorker(worker)
  }

  const results = await Promise.allSettled(areas.map(a => {
    console.log('adding job')
    // TODO: for some reason the entire image is being recognized
    console.log({
      left: a.startX,
      top: a.startY,
      width: a.endX - a.startX,
      height: a.endY - a.startY,
    })
    return scheduler.addJob('recognize', imageData, {
      left: a.startX,
      top: a.startY,
      width: a.endX - a.startX,
      height: a.endY - a.startY,
    })
  }))

  return results
}

export default processImageData