import { RequestSaveDocumentCollection, RequestSaveGroupCollection, RequestSaveProcessedTextCollection } from '../wailsjs/wailsjs/go/ipc/Channel'

const saveDocuments = async () => {
  try {
    const sucessfulSave = await RequestSaveDocumentCollection()
    if (!sucessfulSave) console.error('Could not save DocumentCollection')
  } catch (err) {
    console.error('Could not save DocumentCollection:', err)
  }
}

const saveGroups = async () => {
  try {
    const sucessfulSave = await RequestSaveGroupCollection()
    if (!sucessfulSave) console.error('Could not save GroupCollection')
  } catch (err) {
    console.error('Could not save GroupCollection:', err)
  }
}

const saveProcessedText = async () => {
  try {
    const sucessfulSave = await RequestSaveProcessedTextCollection()
    if (!sucessfulSave) console.error('Could not save ProcessedTextCollection')
  } catch (err) {
    console.error('Could not save ProcessedTextCollection: ', err)
  }
}

export {
  saveDocuments,
  saveGroups,
  saveProcessedText,
}