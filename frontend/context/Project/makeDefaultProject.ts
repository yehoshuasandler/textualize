import { ipc } from '../../wailsjs/wailsjs/go/models'
import { ProjectContextType } from './types'

const makeDefaultProject = (): ProjectContextType => ({
  id: '',
  documents: [] as ipc.Document[],
  groups: [] as ipc.Group[],
  selectedAreaId: '',
  selectedDocumentId: '',
  getSelectedDocument: () => new ipc.Document(),
  getAreaById: (areaId) => undefined,
  requestAddArea: (documentId, area) => Promise.resolve(new ipc.Area()),
  requestUpdateArea: (updatedArea) => Promise.resolve(new ipc.Area()),
  requestAddDocument: (groupId, documentName) => Promise.resolve(new ipc.Document()),
  requestAddDocumentGroup: (groupName: string) => Promise.resolve(new ipc.Group()),
  setSelectedAreaId: (id) => {},
  setSelectedDocumentId: (id) => {}
})

export default makeDefaultProject
