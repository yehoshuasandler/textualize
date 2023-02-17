'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import makeDefaultNavigation from './makeDefaultNavigation'
import { mainPages, NavigationContextType, NavigationProps, workspaces } from './types'

const NavigationContext = createContext<NavigationContextType>(makeDefaultNavigation())

export function useNavigation() {
  return useContext(NavigationContext)
}

type Props = { children: ReactNode, navigationProps: NavigationProps }
export function NavigationProvidor({ children, navigationProps }: Props) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<workspaces>(navigationProps.selectedWorkspace)
  const [selectedMainPage, setSelectedMainPage] = useState<mainPages>(mainPages.SELECTPROJECT)

  const value = {
    selectedWorkspace,
    setSelectedWorkspace,
    selectedMainPage,
    setSelectedMainPage
  }

  return <NavigationContext.Provider value={value}>
    { children }
  </NavigationContext.Provider>
}