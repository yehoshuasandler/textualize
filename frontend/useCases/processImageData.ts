import { createScheduler, createWorker } from 'tesseract.js'
import { GetDocumentById } from '../wailsjs/wailsjs/go/ipc/Channel'
import loadImage from './loadImage'

const getImageWorkerCount = (areaCount: number) => {
  const minWorkerCount = 1
  const maxWorkerCount = 10
  const areasPerWorker = 10

  if (areaCount > maxWorkerCount * areasPerWorker) return maxWorkerCount;
  if (areaCount <= areasPerWorker) return minWorkerCount
  return ~~(areaCount / areasPerWorker) 
}

const processImageData = async (documentId: string) => {
  const foundDocument = await GetDocumentById(documentId)
  if (!foundDocument.path || !foundDocument.areas?.length) return

  const { areas, path } = foundDocument

  console.log(`about to load: ${path}`)

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
    return scheduler.addJob('recognize', imageData, { rectangle: {
      left: a.startX,
      top: a.startY,
      width: a.endX - a.startX,
      height: a.endY - a.startY,
    }})
  }))

  return results
}

export default processImageData