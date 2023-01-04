'use client'

import { AppProps } from 'next/app'
import { ProjectProvider } from '../context/Project/provider'
import '../styles/globals.css'
import { ipc } from '../wailsjs/wailsjs/go/models'
import '../styles/globals.css'

const initialProjectProps = {
  id: '',
  documents: [] as ipc.Document[],
  groups: [] as ipc.Group[]
}

export default function MainAppLayout({ Component, pageProps }: AppProps) {
  return <div className='min-h-screen' >
    <ProjectProvider projectProps={initialProjectProps}>
      <Component {...pageProps} />
    </ProjectProvider>
  </div>
}
