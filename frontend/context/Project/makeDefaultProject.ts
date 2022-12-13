import { ipc } from "../../wailsjs/wailsjs/go/models"
import { ProjectContextType } from "./types"

const makeDefaultProject = (): ProjectContextType => ({
  id: '',
  documents: [] as ipc.Document[],
  groups: [] as ipc.Group[],
  requestAddDocument: (groupId: string, documentName: string) => Promise.resolve(new ipc.Document()),
  requestAddDocumentGroup: (groupName: string) => Promise.resolve(new ipc.Group())
})

export default makeDefaultProject
