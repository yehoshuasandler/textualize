'use client'

import { AppProps } from 'next/app'
import { ProjectProvider } from '../context/Project/provider'
import '../styles/globals.css'
import { ipc } from '../wailsjs/wailsjs/go/models'
import '../styles/globals.css'
import { NavigationProvidor } from '../context/Navigation/provider'
import { workspaces } from '../context/Navigation/types'

const initialProjectProps = {
  id: '',
  documents: [] as ipc.Document[],
  groups: [] as ipc.Group[]
}

const initialNavigationProps = {
  selectedWorkspace: workspaces.PROCESSOR
}

export default function MainAppLayout({ Component, pageProps }: AppProps) {
  return <div className='min-h-screen' >
    <NavigationProvidor navigationProps={initialNavigationProps}>
      <ProjectProvider projectProps={initialProjectProps}>
        <Component {...pageProps} />
      </ProjectProvider>
    </NavigationProvidor>
  </div>
}
