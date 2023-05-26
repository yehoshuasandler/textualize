import { entities } from '../../wailsjs/wailsjs/go/models'
import { ProjectContextType, UserProps } from './types'

const makeDefaultProject = (): ProjectContextType => ({
  id: '',
  documents: [] as entities.Document[],
  groups: [] as entities.Group[],
  selectedAreaId: '',
  selectedDocumentId: '',
  getSelectedDocument: () => new entities.Document(),
  getAreaById: (areaId) => undefined,
  getProcessedAreasByDocumentId: (documentId) => Promise.resolve([new entities.ProcessedArea()]),
  requestAddProcessedArea: (processesArea) => Promise.resolve(new entities.ProcessedArea()),
  requestAddArea: (documentId, area) => Promise.resolve(new entities.Area()),
  requestUpdateArea: (updatedArea) => Promise.resolve(new entities.Area()),
  requestDeleteAreaById: (areaId) => Promise.resolve(false),
  requestAddDocument: (groupId, documentName) => Promise.resolve(new entities.Document()),
  requestDeleteDocumentById: (documentId) => Promise.resolve(false),
  requestAddDocumentGroup: (groupName: string) => Promise.resolve(new entities.Group()),
  requestUpdateDocumentUserMarkdown: (documentId: string, markdown: string) => Promise.resolve(new entities.UserMarkdown()),
  getUserMarkdownByDocumentId: (documentId) => Promise.resolve(new entities.UserMarkdown),
  setSelectedAreaId: (id) => {},
  setSelectedDocumentId: (id) => {},
  currentSession: new entities.Session(),
  createNewProject: (name: string) => Promise.resolve(new entities.Session()),
  requestUpdateCurrentUser: (updatedUserProps: UserProps) => Promise.resolve(new entities.User()),
  requestChooseUserAvatar: () => Promise.resolve(''),
  requestUpdateDocument: ({}) => Promise.resolve(new entities.Document),
  requestChangeAreaOrder: (areaId: string, newOrder: number) => Promise.resolve(new entities.Document()),
  requestChangeGroupOrder: (groupId: string, newOrder: number) => Promise.resolve(new entities.Group()),
  getGroupById: (groupId) => undefined,
  requestSelectProjectByName: (projectName) => Promise.resolve(false),
  requestUpdateProcessedWordById: (wordId, newTestValue) => Promise.resolve(false),
  getProcessedAreaById: (areaId) => Promise.resolve(undefined),
})

export default makeDefaultProject
