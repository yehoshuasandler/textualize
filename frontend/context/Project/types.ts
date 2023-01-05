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

export type ProjectContextType = {
  getSelectedDocument: () => ipc.Document | undefined
  getAreaById: (areaId: string) => ipc.Area | undefined
  requestAddArea: (documentId: string, area: AddAreaProps) => Promise<ipc.Area>
  requestUpdateArea: (area: AreaProps) => Promise<ipc.Area>
  requestAddDocument: (groupId: string, documentName: string) => Promise<ipc.Document>
  requestAddDocumentGroup: (groupName: string) => Promise<ipc.Group>
  selectedDocumentId: string
  setSelectedDocumentId: (id: string) => void
} & ProjectProps