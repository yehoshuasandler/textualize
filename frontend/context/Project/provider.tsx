'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { GetCurrentSession, GetDocuments, } from '../../wailsjs/wailsjs/go/ipc/Channel'
import { entities } from '../../wailsjs/wailsjs/go/models'
import { ProjectContextType, ProjectProps } from './types'
import makeDefaultProject from './makeDefaultProject'
import { saveDocuments } from '../../useCases/saveData'
import createAreaProviderMethods from './createAreaProviderMethods'
import createDocumentProviderMethods from './createDocumentMethods'
import createSessionProviderMethods from './createSessionProviderMethods'
import createUserMarkdownProviderMethods from './createUserMarkdownProviderMethods'

const ProjectContext = createContext<ProjectContextType>(makeDefaultProject())

export function useProject() {
  return useContext(ProjectContext)
}

type Props = { children: ReactNode, projectProps: ProjectProps }
export function ProjectProvider({ children, projectProps }: Props) {
  const [documents, setDocuments] = useState<entities.Document[]>(projectProps.documents)
  const [groups, setGroups] = useState<entities.Group[]>(projectProps.groups)
  const [selectedAreaId, setSelectedAreaId] = useState<string>('')
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('')
  const [currentSession, setCurrentSession] = useState<entities.Session>(new entities.Session())

  const updateDocuments = async () => {
    const response = await GetDocuments()
    const { documents, groups } = response
    setDocuments(documents)
    setGroups(groups)
    return response
  }

  const updateSession = async () => {
    const response = await GetCurrentSession()
    if (response) setCurrentSession(response)
    return response
  }

  const documentMethods = createDocumentProviderMethods({ documents, saveDocuments, updateDocuments, selectedDocumentId, groups })
  const areaMethods = createAreaProviderMethods({ documents, updateDocuments, selectedDocumentId })
  const sessionMethods = createSessionProviderMethods({ updateSession, updateDocuments })
  const userMarkDownMethods = createUserMarkdownProviderMethods()


  useEffect(() => {
    if (!documents.length && !groups.length) updateDocuments()
  }, [documents.length, groups.length])


  useEffect(() => {
    if ((!currentSession?.user?.localId || !currentSession?.user?.id)) {
      updateSession()
    }
  }, [currentSession?.user?.localId, currentSession?.user?.id])

  const value = {
    id: '',
    documents,
    groups,
    selectedAreaId,
    setSelectedAreaId,
    selectedDocumentId,
    setSelectedDocumentId,
    currentSession,
    ...areaMethods,
    ...documentMethods,
    ...sessionMethods,
    ...userMarkDownMethods,
  }

  return <ProjectContext.Provider value={value}>
    {children}
  </ProjectContext.Provider>
}