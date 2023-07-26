import { ipc, entities } from '../../wailsjs/wailsjs/go/models'

export type ProjectProps = {
  id: string,
  documents: entities.Document[],
  groups: entities.Group[],
  contextGroups: entities.SerializedLinkedProcessedArea[],
}

export type AddAreaProps = {
  name?: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number
}

export type AreaProps = { id: string } & AddAreaProps

export type UserProps = {
  id?: string,
  localId?: string,
  firstName?: string,
  lastName?: string,
  avatarPath?: string,
  authToken?: string,
  email?: string
}

export type UpdateDocumentRequest = {
  id?: string,
  projectId?: string,
  groupId?: string,
  name?: string,
  path?: string,
  areas?: entities.Area[]
  defaultLanguage?: entities.Language
}

export type ProjectContextType = {
  getSelectedDocument: () => entities.Document | undefined
  getAreaById: (areaId: string) => entities.Area | undefined
  getProcessedAreasByDocumentId: (documentId: string) => Promise<entities.ProcessedArea[]>
  requestAddProcessedArea: (processedArea: entities.ProcessedArea) => Promise<boolean>
  requestAddArea: (documentId: string, area: AddAreaProps) => Promise<entities.Area>
  requestUpdateArea: (area: AreaProps) => Promise<boolean>
  requestDeleteAreaById: (areaId: string) => Promise<boolean>
  requestAddDocument: (groupId: string, documentName: string) => Promise<entities.Document>
  requestDeleteDocumentById: (documentId: string) => Promise<boolean>
  requestAddDocumentGroup: (groupName: string) => Promise<entities.Group>
  requestUpdateDocumentUserMarkdown: (documentId: string, markdown: string) => Promise<entities.UserMarkdown>
  getUserMarkdownByDocumentId: (documentId: string) => Promise<entities.UserMarkdown>
  selectedAreaId: string
  setSelectedAreaId: (id: string) => void
  selectedDocumentId: string
  setSelectedDocumentId: (id: string) => void
  currentSession: entities.Session
  createNewProject: (name: string) => Promise<entities.Session>
  requestUpdateCurrentUser: (updatedUserProps: UserProps) => Promise<entities.User>
  requestChooseUserAvatar: () => Promise<string>
  requestUpdateDocument: (request: UpdateDocumentRequest) => Promise<entities.Document>
  requestChangeAreaOrder: (areaId: string, newOrder: number) => Promise<entities.Document>
  requestChangeGroupOrder: (groupId: string, newOrder: number) => Promise<entities.Group>
  getGroupById: (groupId: string) => entities.Group | undefined
  requestSelectProjectByName: (projectName: string) => Promise<boolean>
  requestUpdateProcessedWordById: (wordId: string, newTextValue: string) => Promise<boolean>
  getProcessedAreaById: (areaId: string) => Promise<entities.ProcessedArea | undefined>
  requestUpdateProcessedArea: (updatedProcessedArea: entities.ProcessedArea) => Promise<boolean>
  requestConnectProcessedAreas: (headId: string, tailId: string) => Promise<boolean>
  getSerializedContextGroups: () => Promise<entities.SerializedLinkedProcessedArea[]>
} & ProjectProps