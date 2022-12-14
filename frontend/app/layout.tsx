'use client'

import { ProjectProvider } from '../context/Project/provider'
import '../styles/globals.css'
import { ipc } from '../wailsjs/wailsjs/go/models'

type AppLayoutProps = {
  children: React.ReactNode
}

const initialProjectProps = {
  id: '',
  documents: [] as ipc.Document[],
  groups: [] as ipc.Group[]
}

export default function MainAppLayout({ children }: AppLayoutProps) {
  return <html className='bg-gray-100 bg-opacity-0'>
    <body className='min-h-screen' >
      <ProjectProvider projectProps={initialProjectProps}>
        {children}
      </ProjectProvider>
    </body>
  </html>
}
