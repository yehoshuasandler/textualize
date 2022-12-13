'use client'

import React, { useRef, useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid'
import AppBar from './AppBar'
import Sidebar from './Sidebar'

function WorkspaceNavigation() {

  return (
    <>
      <Sidebar />
      <AppBar />
    </>
  )
}

export default WorkspaceNavigation
