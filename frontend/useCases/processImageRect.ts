import { PSM, createScheduler, createWorker } from 'tesseract.js'
import { GetDocumentById, RequestAddArea, RequestAddProcessedArea } from '../wailsjs/wailsjs/go/ipc/Channel'
import loadImage from './loadImage'
import { entities } from '../wailsjs/wailsjs/go/models'
import { saveProcessedText } from './saveData'

type rect = {
  startX: number,
  endX: number,
  startY: number,
  endY: number,
}

const processImageRect = async (documentId: string, rectangle: rect): Promise<entities.ProcessedArea[]> => {
  const foundDocument = await GetDocumentById(documentId)
  const { path, defaultLanguage } = foundDocument
  if (!path || !defaultLanguage) return []

  const processLanguage = defaultLanguage.processCode
  const imageData = await loadImage(path)

  let workerOptions: Partial<Tesseract.WorkerOptions> = {}
  if (foundDocument.defaultLanguage.isBundledCustom) {
    workerOptions = {
      langPath: '/customLanguages',
      gzip: false,
      // logger: m => console.log(m)
    }
  }

  const worker = await createWorker(workerOptions)
  await worker.loadLanguage(processLanguage)
  await worker.initialize(processLanguage)
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.AUTO_OSD,
  })

  const scheduler = createScheduler()
  scheduler.addWorker(worker)

  const result = await scheduler.addJob('recognize', imageData, {
    rectangle: {
      left: rectangle.startX,
      top: rectangle.startY,
      width: rectangle.endX - rectangle.startX,
      height: rectangle.endY - rectangle.startY,
    }
  })

  const addAreaRequests = result.data.paragraphs.map(async (p: any) => {
    const defaultAreaName = p.lines[0]?.words[0]?.text || ''
    const area = await RequestAddArea(
      documentId,
      new entities.Area({
        name: defaultAreaName,
        startX: p.bbox.x0,
        endX: p.bbox.x1,
        startY: p.bbox.y0,
        endY: p.bbox.y1,
      })
    )

    const processedArea = await RequestAddProcessedArea(new entities.ProcessedArea({
      id: area.id,
      documentId,
      order: area.order,
      fullText: p.text,
      lines: p.lines.map((l: any) => new entities.ProcessedLine({
        fullText: l.text,
        words: l.words.map((w: any) => new entities.ProcessedWord({
          areaId: area.id,
          fullText: w.text,
          direction: w.direction,
          confidence: w.confidence,
          boundingBox: new entities.ProcessedBoundingBox({
            x0: w.bbox.x0,
            y0: w.bbox.y0,
            x1: w.bbox.x1,
            y1: w.bbox.y1,
          }),
          symbols: w.symbols.map((s: any) => new entities.ProcessedSymbol({
            fullText: s.text,
            confidence: s.confidence,
            boundingBox: new entities.ProcessedBoundingBox({
              x0: s.bbox.x0,
              y0: s.bbox.y0,
              x1: s.bbox.x1,
              y1: s.bbox.y1,
            })
          }))
        }))
      }))
    }))
    return processedArea
  })

  const addAreaResponses = await Promise.allSettled(addAreaRequests)
  const areas = addAreaResponses.filter((val): val is PromiseFulfilledResult<entities.ProcessedArea> => val.status === 'fulfilled').map(val => val.value)
  await saveProcessedText()
  return areas
}

export default processImageRect
