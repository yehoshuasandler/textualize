'use client'

import Sidebar from './Sidebar/Sidebar'
import { SidebarProvider } from './Sidebar/provider'
import TopBar from './TopBar'

function WorkspaceNavigation() {

  return (
    <>
      <TopBar />
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>
    </>
  )
}

export default WorkspaceNavigation
