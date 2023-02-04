import { createScheduler, createWorker } from 'tesseract.js'
import { GetDocumentById, RequestAddProcessedArea } from '../wailsjs/wailsjs/go/ipc/Channel'
import { ipc } from '../wailsjs/wailsjs/go/models'
import loadImage from './loadImage'

const processImageArea = async (documentId: string, area: ipc.Area) => {
  const foundDocument = await GetDocumentById(documentId)
  if (!foundDocument.path || !foundDocument.areas?.length) return

  const { path } = foundDocument
  const imageData = await loadImage(path)

  const scheduler = createScheduler()
  const worker = await createWorker()
  await worker.loadLanguage('eng') // TODO: change this when multilangiage system is implementd
  await worker.initialize('eng') // TODO: same here
  scheduler.addWorker(worker)

  const result = await scheduler.addJob('recognize', imageData, {
    rectangle: {
      left: area.startX,
      top: area.startY,
      width: area.endX - area.startX,
      height: area.endY - area.startY,
    }
  })

  const addProcessesAreaRequest = await RequestAddProcessedArea(new ipc.ProcessedArea({
    id: area.id,
    documentId,
    fullText: result.data.text,
    lines: result.data.lines.map((l: any) => new ipc.ProcessedLine({
      fullText: l.text,
      words: l.words.map((w: any) => new ipc.ProcessedWord({
        fullText: w.text,
        direction: w.direction,
        confidence: w.confidence,
        boundingBox: new ipc.ProcessedBoundingBox({
          x0: w.bbox.x0,
          y0: w.bbox.y0,
          x1: w.bbox.x1,
          y1: w.bbox.y1,
        }),
        symbols: w.symbols.map((s: any) => new ipc.ProcessedSymbol({
          fullText: s.text,
          confidence: s.confidence,
          boundingBox: new ipc.ProcessedBoundingBox({
            x0: s.bbox.x0,
            y0: s.bbox.y0,
            x1: s.bbox.x1,
            y1: s.bbox.y1,
          })
        }))
      }))
    }))
  }))

  return addProcessesAreaRequest
}

export default processImageArea
