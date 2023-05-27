import { saveUserProcessedMarkdown } from '../../useCases/saveData'
import { GetUserMarkdownByDocumentId, RequestUpdateDocumentUserMarkdown } from '../../wailsjs/wailsjs/go/ipc/Channel'
import { ipc, entities } from '../../wailsjs/wailsjs/go/models'

type Dependencies = {}

const createUserMarkdownProviderMethods = (dependencies?: Dependencies) => {

  const requestUpdateDocumentUserMarkdown = async (documentId: string, markdown: string) => {
    let response = new entities.UserMarkdown()
    try {
      response = await RequestUpdateDocumentUserMarkdown(documentId, markdown)
      await saveUserProcessedMarkdown()
    } catch (err) {
      console.error(err)
    }
    return response
  }

  const getUserMarkdownByDocumentId = async (documentId: string): Promise<entities.UserMarkdown> => {
    let response = new entities.UserMarkdown({})
    try {
      response = await GetUserMarkdownByDocumentId(documentId)
    } catch (err) {
      console.error(err)
    }

    return response
  }

  return {
    requestUpdateDocumentUserMarkdown,
    getUserMarkdownByDocumentId,
  }
}

export default createUserMarkdownProviderMethods
