import { createContext, ReactNode, useContext, useState } from 'react'
import { GetDocuments, RequestAddDocument, RequestAddDocumentGroup } from '../../wailsjs/wailsjs/go/ipc/Channel'
import { ipc } from '../../wailsjs/wailsjs/go/models'
import { ProjectContextType, ProjectProps } from './types'
import makeDefaultProject from './makeDefaultProject'

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
      setDocuments(response.documents)
      setGroups(response.groups)
      Promise.resolve(response)
    })
  }

  const requestAddDocument = async (groupId: string, documentName: string) => {
    const response = await RequestAddDocument(groupId, documentName)
    if (response.id) updateDocuments()
    return response
  }

  const requestAddDocumentGroup = async (groupName: string) => {
    const response = await RequestAddDocumentGroup(groupName)
    if (response.id) updateDocuments()
    return response
  }

  const getSelectedDocument = () => documents.find(d => d.id === selectedDocumentId)

  if (!documents.length || !groups.length) updateDocuments()

  const value = {
    id: '',
    documents,
    groups,
    getSelectedDocument,
    requestAddDocument,
    requestAddDocumentGroup,
    selectedDocumentId,
    setSelectedDocumentId,
  }

  return <ProjectContext.Provider value={value}>
    { children }
  </ProjectContext.Provider>
}