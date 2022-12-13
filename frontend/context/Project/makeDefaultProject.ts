import { ipc } from "../../wailsjs/wailsjs/go/models"
import { ProjectContextType } from "./types"

const makeDefaultProject = (): ProjectContextType => ({
  id: '',
  documents: [] as ipc.Document[],
  groups: [] as ipc.DocumentGroup[],
  requestAddDocument: (groupId: string, documentName: string) => Promise.resolve(new ipc.Document()),
  requestAddDocumentGroup: (groupName: string) => Promise.resolve(new ipc.DocumentGroup())
})

export default makeDefaultProject
