'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import makeDefaultNavigation from './makeDefaultNavigation'
import { mainPages, NavigationContextType, NavigationProps, workspaces } from './types'

const NavigationContext = createContext<NavigationContextType>(makeDefaultNavigation())

export function useNavigation() {
  return useContext(NavigationContext)
}

type Props = { children: ReactNode, navigationProps: NavigationProps }
export function NavigationProvider({ children, navigationProps }: Props) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<workspaces>(navigationProps.selectedWorkspace)
  const [selectedMainPage, setSelectedMainPage] = useState<mainPages>(navigationProps.selectedMainPage)

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