'use client'

import { AppProps } from 'next/app'
import { ProjectProvider } from '../context/Project/provider'
import '../styles/globals.css'
import { entities } from '../wailsjs/wailsjs/go/models'
import '../styles/globals.css'
import { NavigationProvider } from '../context/Navigation/provider'
import { mainPages, workspaces } from '../context/Navigation/types'
import { NotificationProvider } from '../context/Notification/provider'
import { Providers } from '../redux/provider'

const initialProjectProps = {
  id: '',
  documents: [] as entities.Document[],
  groups: [] as entities.Group[]
}

const initialNavigationProps = {
  selectedWorkspace: workspaces.PROCESSOR,
  selectedMainPage: mainPages.EDITUSER
}

export default function MainAppLayout({ Component, pageProps }: AppProps) {
  return <div className='min-h-screen' >
    <NavigationProvider navigationProps={initialNavigationProps}>
      <ProjectProvider projectProps={initialProjectProps}>
        <NotificationProvider>
          <Providers>
            <Component {...pageProps} />
          </Providers>
        </NotificationProvider>
      </ProjectProvider>
    </NavigationProvider>
  </div>
}
