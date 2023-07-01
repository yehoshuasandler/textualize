import { createScheduler, createWorker } from 'tesseract.js'
import { GetAreaById, GetDocumentById, GetProcessedAreaById, RequestAddProcessedArea, RequestSaveProcessedTextCollection, RequestUpdateProcessedArea } from '../wailsjs/wailsjs/go/ipc/Channel'
import { entities } from '../wailsjs/wailsjs/go/models'
import loadImage from './loadImage'
import { saveProcessedText } from './saveData'

const processImageArea = async (documentId: string, areaId: string) => {
  const foundDocument = await GetDocumentById(documentId)
  const foundArea = await GetAreaById(areaId)
  if (!foundDocument.path || !foundDocument.areas?.length || !foundArea.id) return

  console.log(foundArea)

  const processLanguage = foundArea.language.processCode || foundDocument.defaultLanguage.processCode

  if (!processLanguage) return console.error('No process language selected')

  const { path } = foundDocument
  const imageData = await loadImage(path)

  let workerOptions: Partial<Tesseract.WorkerOptions> = {}
  if (foundDocument.defaultLanguage.isBundledCustom) {
    workerOptions = {
      langPath: '/customLanguages',
      gzip: false,
      logger: m => console.log(m)
    }
  }

  const worker = await createWorker(workerOptions)
  const scheduler = createScheduler()

  await worker.loadLanguage(processLanguage)
  await worker.initialize(processLanguage)
  scheduler.addWorker(worker)

  const result = await scheduler.addJob('recognize', imageData, {
    rectangle: {
      left: foundArea.startX,
      top: foundArea.startY,
      width: foundArea.endX - foundArea.startX,
      height: foundArea.endY - foundArea.startY,
    }
  })

  const newProcessedArea = new entities.ProcessedArea({
    id: foundArea.id,
    documentId,
    order: foundArea.order,
    fullText: result.data.text,
    lines: result.data.lines.map((l: any) => new entities.ProcessedLine({
      fullText: l.text,
      words: l.words.map((w: any) => new entities.ProcessedWord({
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
  })

  console.log(newProcessedArea)


  const existingProcessedArea = await GetProcessedAreaById(areaId)
  let didSuccessfullyProcess = false
  if (existingProcessedArea.id !== areaId) didSuccessfullyProcess = await RequestAddProcessedArea(newProcessedArea)
  else await RequestUpdateProcessedArea(newProcessedArea)

  saveProcessedText()
  return didSuccessfullyProcess
}

export default processImageArea
