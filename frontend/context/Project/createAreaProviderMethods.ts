import { saveDocuments } from '../../useCases/saveData'
import { GetProcessedAreasByDocumentId, RequestAddArea, RequestAddProcessedArea, RequestChangeAreaOrder, RequestDeleteAreaById, RequestUpdateArea } from '../../wailsjs/wailsjs/go/ipc/Channel'
import { entities, ipc } from '../../wailsjs/wailsjs/go/models'
import { AddAreaProps, AreaProps } from './types'

type Dependencies = {
  documents: entities.Document[]
  updateDocuments: () => Promise<ipc.GetDocumentsResponse>
  selectedDocumentId: string
}

const createAreaProviderMethods = (dependencies: Dependencies) => {
  const { documents, updateDocuments, selectedDocumentId } = dependencies

  const getAreaById = (areaId: string): entities.Area | undefined => (
    documents.map(d => d.areas).flat().find(a => a.id === areaId)
  )

  const getProcessedAreaById = async (areaId: string) => {
    try {
      if (!selectedDocumentId || !areaId) return
      const processedAreas = await getProcessedAreasByDocumentId(selectedDocumentId)
      const foundProcessedArea = processedAreas.find(a => a.id === areaId)
      return foundProcessedArea
    } catch (err) {
      console.error(err)
      return Promise.resolve(undefined)
    }
  }

  const getProcessedAreasByDocumentId = async (documentId: string) => {
    let response: entities.ProcessedArea[] = []
    try {
      response = await GetProcessedAreasByDocumentId(documentId)
    } catch (err) {
      console.log(err)
    }
    return response
  }

  const requestAddArea = async (documentId: string, area: AddAreaProps): Promise<entities.Area> => {
    const response = await RequestAddArea(documentId, new entities.Area(area))
    if (response.id) await updateDocuments()
    saveDocuments()
    return response
  }

  const requestUpdateArea = async (updatedArea: AreaProps): Promise<entities.Area> => {
    const response = await RequestUpdateArea(new entities.Area(updatedArea))

    if (response.id) await updateDocuments()
    saveDocuments()
    return response
  }

  const requestDeleteAreaById = async (areaId: string): Promise<boolean> => {
    const wasSuccessfulDeletion = await RequestDeleteAreaById(areaId)
    if (wasSuccessfulDeletion) updateDocuments()
    saveDocuments()
    return wasSuccessfulDeletion
  }

  const requestAddProcessedArea = async (processedArea: entities.ProcessedArea) => await RequestAddProcessedArea(processedArea)

  const requestChangeAreaOrder = async (areaId: string, newOrder: number) => {
    const response = await RequestChangeAreaOrder(areaId, newOrder)
    await updateDocuments()
    saveDocuments()
    return response
  }

  return {
    requestAddArea,
    requestUpdateArea,
    getAreaById,
    requestDeleteAreaById,
    getProcessedAreasByDocumentId,
    requestAddProcessedArea,
    requestChangeAreaOrder,
    getProcessedAreaById,
  }
}

export default createAreaProviderMethods
