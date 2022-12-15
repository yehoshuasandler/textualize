import { createContext, ReactNode, useContext, useState } from 'react'
import { GetDocuments, RequestAddArea, RequestAddDocument, RequestAddDocumentGroup } from '../../wailsjs/wailsjs/go/ipc/Channel'
import { ipc } from '../../wailsjs/wailsjs/go/models'
import { AddAreaProps, ProjectContextType, ProjectProps } from './types'
import makeDefaultProject from './makeDefaultProject'
import { LogPrint } from '../../wailsjs/wailsjs/runtime/runtime'

const ProjectContext = createContext<ProjectContextType>(makeDefaultProject())

export function useProject() {
  return useContext(ProjectContext)
}

type Props = { children: ReactNode, projectProps: ProjectProps }
export function ProjectProvider({ children, projectProps }: Props) {
  const [ documents, setDocuments ] = useState<ipc.Document[]>(projectProps.documents)
  const [ groups, setGroups ] = useState<ipc.Group[]>(projectProps.groups)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('')

  const updateDocuments = async () => {
    GetDocuments().then(response => {
      if (response.documents.length) setDocuments(response.documents)
      if (response.groups.length) setGroups(response.groups)
      Promise.resolve(response)
    })
  }

  const requestAddDocument = async (groupId: string, documentName: string) => {
    const response = await RequestAddDocument(groupId, documentName)
    if (response.id) await updateDocuments()
    return response
  }

  const requestAddDocumentGroup = async (groupName: string) => {
    const response = await RequestAddDocumentGroup(groupName)
    if (response.id) await updateDocuments()
    return response
  }

  const requestAddArea = async (documentId: string, area: AddAreaProps): Promise<ipc.Area> => {
    const response = await RequestAddArea(documentId, new ipc.Area(area))

    if (response.id) await updateDocuments()
    return response
  }

  const getSelectedDocument = () => documents.find(d => d.id === selectedDocumentId)

  if (!documents.length && !groups.length) updateDocuments()

  const value = {
    id: '',
    documents,
    groups,
    getSelectedDocument,
    requestAddArea,
    requestAddDocument,
    requestAddDocumentGroup,
    selectedDocumentId,
    setSelectedDocumentId,
  }

  return <ProjectContext.Provider value={value}>
    { children }
  </ProjectContext.Provider>
}