import { saveGroups } from '../../useCases/saveData'
import { RequestAddDocument, RequestAddDocumentGroup, RequestChangeGroupOrder, RequestDeleteDocumentAndChildren, RequestUpdateDocument, RequestUpdateProcessedWordById } from '../../wailsjs/wailsjs/go/ipc/Channel'
import { ipc, entities } from '../../wailsjs/wailsjs/go/models'
import { UpdateDocumentRequest } from './types'

type Dependencies = {
  selectedDocumentId: string
  documents: entities.Document[]
  saveDocuments: () => Promise<void>
  updateDocuments: () => Promise<ipc.GetDocumentsResponse>
  groups: entities.Group[]
}

const createDocumentProviderMethods = (dependencies: Dependencies) => {
  const { selectedDocumentId, documents, saveDocuments, updateDocuments, groups } = dependencies

  const getGroupById = (groupId: string): entities.Group | undefined => (
    groups.find(g => g.id === groupId)
  )

  const getSelectedDocument = () => documents.find(d => d.id === selectedDocumentId)

  const requestAddDocument = async (groupId: string, documentName: string) => {
    const response = await RequestAddDocument(groupId, documentName)
    if (response.id) await updateDocuments()
    saveDocuments()
    return response
  }

  const requestDeleteDocumentById = async (documentId: string): Promise<boolean> => {
    const wasSuccessfulDeletion = await RequestDeleteDocumentAndChildren(documentId)
    updateDocuments()
    saveDocuments()
    return wasSuccessfulDeletion
  }

  const requestAddDocumentGroup = async (groupName: string) => {
    const response = await RequestAddDocumentGroup(groupName)
    if (response.id) await updateDocuments()
    saveGroups()
    return response
  }

  const requestUpdateDocument = async (documentProps: UpdateDocumentRequest) => {
    const response = await RequestUpdateDocument(new entities.Document(documentProps))
    await updateDocuments()
    saveDocuments()
    return response
  }

  const requestChangeGroupOrder = async (groupId: string, newOrder: number) => {
    const response = await RequestChangeGroupOrder(groupId, newOrder)
    console.log('should be at ', newOrder)
    console.log(response)
    await updateDocuments()
    saveGroups()
    return response
  }


  const requestUpdateProcessedWordById = async (wordId: string, newTextValue: string) => {
    const successfulResponse = await RequestUpdateProcessedWordById(wordId, newTextValue)
    return successfulResponse
  }

  return {
    getGroupById,
    getSelectedDocument,
    requestAddDocument,
    requestDeleteDocumentById,
    requestAddDocumentGroup,
    requestUpdateDocument,
    requestChangeGroupOrder,
    requestUpdateProcessedWordById,
  }
}

export default createDocumentProviderMethods
