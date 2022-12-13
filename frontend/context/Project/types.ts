import { ipc } from "../../wailsjs/wailsjs/go/models"

export type ProjectProps = {
  id: string,
  documents: ipc.Document[],
  groups: ipc.Group[],
}

export type ProjectContextType = {
  requestAddDocument: (groupId: string, documentName: string) => Promise<ipc.Document>,
  requestAddDocumentGroup: (groupName: string) => Promise<ipc.Group>,
} & ProjectProps