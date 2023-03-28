import { RequestSaveDocumentCollection, RequestSaveGroupCollection } from '../wailsjs/wailsjs/go/ipc/Channel'

const saveDocuments = async () => {
  try {
    const sucessfulSave = RequestSaveDocumentCollection()
    if (!sucessfulSave) console.error('Could not save DocumentCollection')
  } catch (err) {
    console.error('Could not save DocumentCollection:', err)
  }
}

const saveGroups = async () => {
  try {
    const sucessfulSave = RequestSaveGroupCollection()
    if (!sucessfulSave) console.error('Could not save GroupCollection')
  } catch (err) {
    console.error('Could not save GroupCollection:', err)
  }
}

export {
  saveDocuments,
  saveGroups,
}