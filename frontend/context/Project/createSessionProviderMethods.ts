import { CreateNewProject, RequestChangeSessionProjectByName, RequestChooseUserAvatar, RequestUpdateCurrentUser } from '../../wailsjs/wailsjs/go/ipc/Channel'
import { ipc } from '../../wailsjs/wailsjs/go/models'
import { UserProps } from './types'

type Dependencies = {
  updateSession: () => Promise<ipc.Session>
  updateDocuments: () => Promise<ipc.GetDocumentsResponse>
}

const createSessionProviderMethods = (dependencies: Dependencies) => {
  const { updateSession, updateDocuments } = dependencies

  const createNewProject = async (name: string) => {
    const sessionResponse = await CreateNewProject(name)
    await updateSession()
    return sessionResponse
  }

  const requestUpdateCurrentUser = async (userProps: UserProps) => {
    const response = await RequestUpdateCurrentUser(new ipc.User(userProps))
    await updateSession()
    return response
  }

  const requestChooseUserAvatar = async () => {
    const filePathResponse = await RequestChooseUserAvatar()
    return filePathResponse
  }

  const requestSelectProjectByName = async (name: string) => {
    const successfulResponse = await RequestChangeSessionProjectByName(name)
    await updateSession()
    await updateDocuments()
    return successfulResponse
  }

  return {
    createNewProject,
    requestUpdateCurrentUser,
    requestChooseUserAvatar,
    requestSelectProjectByName,
  }
}

export default createSessionProviderMethods
