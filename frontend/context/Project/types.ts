import { ipc } from "../../wailsjs/wailsjs/go/models"

export type ProjectProps = {
  id: string,
  documents: ipc.Document[],
  groups: ipc.Group[],
}

export type ProjectContextType = {
  getSelectedDocument: () => ipc.Document | undefined
  requestAddDocument: (groupId: string, documentName: string) => Promise<ipc.Document>,
  requestAddDocumentGroup: (groupName: string) => Promise<ipc.Group>,
  selectedDocumentId: string,
  setSelectedDocumentId: (id: string) => void,
} & ProjectProps