'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import {
  CreateNewProject, GetCurrentSession, GetDocuments,
  GetProcessedAreasByDocumentId, GetUserMarkdownByDocumentId, RequestAddArea,
  RequestAddDocument, RequestAddDocumentGroup, RequestAddProcessedArea,
  RequestUpdateArea, RequestUpdateCurrentUser, RequestUpdateDocumentUserMarkdown,
  RequestChooseUserAvatar,
} from '../../wailsjs/wailsjs/go/ipc/Channel'
import { ipc } from '../../wailsjs/wailsjs/go/models'
import { AddAreaProps, AreaProps, ProjectContextType, ProjectProps, UserProps } from './types'
import makeDefaultProject from './makeDefaultProject'

const ProjectContext = createContext<ProjectContextType>(makeDefaultProject())

export function useProject() {
  return useContext(ProjectContext)
}

type Props = { children: ReactNode, projectProps: ProjectProps }
export function ProjectProvider({ children, projectProps }: Props) {
  const [documents, setDocuments] = useState<ipc.Document[]>(projectProps.documents)
  const [groups, setGroups] = useState<ipc.Group[]>(projectProps.groups)
  const [selectedAreaId, setSelectedAreaId] = useState<string>('')
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('')
  const [currentSession, setCurrentSession] = useState<ipc.Session>(new ipc.Session())

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

  const requestUpdateArea = async (updatedArea: AreaProps): Promise<ipc.Area> => {
    const response = await RequestUpdateArea(new ipc.Area(updatedArea))

    if (response.id) await updateDocuments()
    return response
  }

  const getAreaById = (areaId: string): ipc.Area | undefined => (
    documents.map(d => d.areas).flat().find(a => a.id === areaId)
  )

  const getSelectedDocument = () => documents.find(d => d.id === selectedDocumentId)

  const getProcessedAreasByDocumentId = async (documentId: string) => {
    let response: ipc.ProcessedArea[] = []
    try {
      response = await GetProcessedAreasByDocumentId(documentId)
    } catch (err) {
      console.log(err)
    }
    return response
  }

  const requestUpdateDocumentUserMarkdown = async (documentId: string, markdown: string) => {
    let response: ipc.UserMarkdown = new ipc.UserMarkdown()
    try {
      response = await RequestUpdateDocumentUserMarkdown(documentId, markdown)
    } catch (err) {
      console.error(err)
    }
    return response
  }

  const getUserMarkdownByDocumentId = async (documentId: string): Promise<ipc.UserMarkdown> => {
    let response: ipc.UserMarkdown = new ipc.UserMarkdown({})
    try {
      response = await GetUserMarkdownByDocumentId(documentId)
    } catch (err) {
      console.error(err)
    }

    return response
  }

  const requestAddProcessedArea = async (processedArea: ipc.ProcessedArea) => await RequestAddProcessedArea(processedArea)

  const updateSession = async () => {
    GetCurrentSession().then(response => {
      if (response) setCurrentSession(response)
      Promise.resolve(response)
    })
  }

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

  useEffect(() => {
    if (!documents.length && !groups.length) updateDocuments()
  }, [documents.length, groups.length])

  const value = {
    id: '',
    documents,
    groups,
    getSelectedDocument,
    getAreaById,
    requestAddArea,
    requestAddDocument,
    requestAddDocumentGroup,
    requestUpdateArea,
    selectedAreaId,
    setSelectedAreaId,
    selectedDocumentId,
    setSelectedDocumentId,
    getProcessedAreasByDocumentId,
    requestAddProcessedArea,
    requestUpdateDocumentUserMarkdown,
    getUserMarkdownByDocumentId,
    currentSession,
    createNewProject,
    requestUpdateCurrentUser,
    requestChooseUserAvatar,
  }

  return <ProjectContext.Provider value={value}>
    {children}
  </ProjectContext.Provider>
}