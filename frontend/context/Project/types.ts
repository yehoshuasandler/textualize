import { ipc } from '../../wailsjs/wailsjs/go/models'

export type ProjectProps = {
  id: string,
  documents: ipc.Document[],
  groups: ipc.Group[],
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
  areas?: ipc.Area[]
  defaultLanguage?: ipc.Language
}

export type ProjectContextType = {
  getSelectedDocument: () => ipc.Document | undefined
  getAreaById: (areaId: string) => ipc.Area | undefined
  getProcessedAreasByDocumentId: (documentId: string) => Promise<ipc.ProcessedArea[]>
  requestAddProcessedArea: (processedArea: ipc.ProcessedArea) => Promise<ipc.ProcessedArea>
  requestAddArea: (documentId: string, area: AddAreaProps) => Promise<ipc.Area>
  requestUpdateArea: (area: AreaProps) => Promise<ipc.Area>
  requestDeleteAreaById: (areaId: string) => Promise<boolean>
  requestAddDocument: (groupId: string, documentName: string) => Promise<ipc.Document>
  requestAddDocumentGroup: (groupName: string) => Promise<ipc.Group>
  requestUpdateDocumentUserMarkdown: (documentId: string, markdown: string) => Promise<ipc.UserMarkdown>
  getUserMarkdownByDocumentId: (documentId: string) => Promise<ipc.UserMarkdown>
  selectedAreaId: string
  setSelectedAreaId: (id: string) => void
  selectedDocumentId: string
  setSelectedDocumentId: (id: string) => void
  currentSession: ipc.Session
  createNewProject: (name: string) => Promise<ipc.Session>
  requestUpdateCurrentUser: (updatedUserProps: UserProps) => Promise<ipc.User>
  requestChooseUserAvatar: () => Promise<string>
  requestUpdateDocument: (request: UpdateDocumentRequest) => Promise<ipc.Document>
  requestChangeAreaOrder: (areaId: string, newOrder: number) => Promise<ipc.Document>
} & ProjectProps