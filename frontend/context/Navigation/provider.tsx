'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import makeDefaultNavigation from './makeDefaultNavigation'
import { NavigationContextType, NavigationProps, workspaces } from './types'

const NavigationContext = createContext<NavigationContextType>(makeDefaultNavigation())

export function useNavigation() {
  return useContext(NavigationContext)
}

type Props = { children: ReactNode, navigationProps: NavigationProps }
export function NavigationProvidor({ children, navigationProps }: Props) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<workspaces>(navigationProps.selectedWorkspace)

  const value = {
    selectedWorkspace,
    setSelectedWorkspace
  }

  return <NavigationContext.Provider value={value}>
    { children }
  </NavigationContext.Provider>
}