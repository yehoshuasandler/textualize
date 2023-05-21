'use client'

import React from 'react'
import { useProject } from '../../../context/Project/provider'
import AddGroupInput from './AddGroupInput'
import GroupLineItem from './GroupLineItem'
import { useSidebar } from './provider'

function Sidebar() {
  const { currentSession } = useProject()
  const { navigationProps } = useSidebar()

  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800 bg-opacity-25">
          <div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4 bg-opacity-25">
            <img className="h-8 w-auto" src='/images/logo.svg' alt="Textualize" />
            <h1 className='text-gray-100 text-xl ml-2'>{currentSession?.project?.name}</h1>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4" aria-label='Sidebar'>
              {<AddGroupInput />}
              {navigationProps.map((group) => <GroupLineItem key={group.id} group={group} />)}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
