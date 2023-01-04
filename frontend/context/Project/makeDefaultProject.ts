import { ipc } from '../../wailsjs/wailsjs/go/models'
import { ProjectContextType } from './types'

const makeDefaultProject = (): ProjectContextType => ({
  id: '',
  documents: [] as ipc.Document[],
  groups: [] as ipc.Group[],
  selectedDocumentId: '',
  getSelectedDocument: () => new ipc.Document(),
  requestAddArea: (documentId, area) => Promise.resolve(new ipc.Area()),
  requestAddDocument: (groupId, documentName) => Promise.resolve(new ipc.Document()),
  requestAddDocumentGroup: (groupName: string) => Promise.resolve(new ipc.Group()),
  setSelectedDocumentId: (id) => {}
})

export default makeDefaultProject
