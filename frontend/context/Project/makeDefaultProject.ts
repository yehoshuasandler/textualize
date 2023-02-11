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
  getProcessedAreasByDocumentId: (documentId) => Promise.resolve([new ipc.ProcessedArea()]),
  requestAddProcessedArea: (processesArea) => Promise.resolve(new ipc.ProcessedArea()),
  requestAddArea: (documentId, area) => Promise.resolve(new ipc.Area()),
  requestUpdateArea: (updatedArea) => Promise.resolve(new ipc.Area()),
  requestAddDocument: (groupId, documentName) => Promise.resolve(new ipc.Document()),
  requestAddDocumentGroup: (groupName: string) => Promise.resolve(new ipc.Group()),
  requestUpdateDocumentUserMarkdown: (documentId: string, markdown: string) => Promise.resolve(new ipc.UserMarkdown()),
  getUserMarkdownByDocumentId: (documentId) => Promise.resolve(new ipc.UserMarkdown),
  setSelectedAreaId: (id) => {},
  setSelectedDocumentId: (id) => {}
})

export default makeDefaultProject
