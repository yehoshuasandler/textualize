'use client'

import { createContext, useContext, useState, ReactNode, } from 'react'
import { useProject } from '../../../context/Project/provider'
import makeDefaultSidebar from './makeDefaultSidebar'
import { getNavigationProps } from './navigationProps'
import { SidebarContextType } from './types'

const SidebarContext = createContext<SidebarContextType>(makeDefaultSidebar())

export function useSidebar() {
  return useContext(SidebarContext)
}

type Props = { children: ReactNode }
export function SidebarProvider({ children }: Props) {
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [isAddNewDocumentInputShowing, setIsAddNewDocumentInputShowing] = useState(false)
  const [isEditDocumentNameInputShowing, setIsEditDocumentNameInputShowing] = useState(false)
  const [isAddNewGroupInputShowing, setIsAddNewGroupInputShowing] = useState(false)
  const [isEditAreaNameInputShowing, setIsEditAreaNameInputShowing] = useState(false)
  const [dragOverGroupId, setDragOverGroupId] = useState('')
  const [dragOverAreaId, setDragOverAreaId] = useState('')


  const {
    selectedDocumentId, setSelectedDocumentId,
    selectedAreaId, setSelectedAreaId,
    documents,
    groups,
  } = useProject()

  const navigationProps = getNavigationProps(documents, groups)

  const value = {
    navigationProps,
    selectedGroupId,
    setSelectedGroupId,
    selectedDocumentId,
    setSelectedDocumentId,
    selectedAreaId,
    setSelectedAreaId,
    isAddNewDocumentInputShowing,
    setIsAddNewDocumentInputShowing,
    isEditDocumentNameInputShowing,
    setIsEditDocumentNameInputShowing,
    isAddNewGroupInputShowing,
    setIsAddNewGroupInputShowing,
    isEditAreaNameInputShowing,
    setIsEditAreaNameInputShowing,
    dragOverGroupId,
    setDragOverGroupId,
    dragOverAreaId,
    setDragOverAreaId,
  }

  return <SidebarContext.Provider value={value}>
    { children }
  </SidebarContext.Provider>
}