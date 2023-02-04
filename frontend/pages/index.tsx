import { NextPage } from 'next'
import { useState } from 'react'
import MainHead from '../components/head'
import MainWorkspace from '../components/workspace/Main'
import Navigation from '../components/workspace/Navigation'

enum workspaces {
  PROCESSOR = 'PROCESSOR',
  TEXTEDITOR = 'TEXTEDITOR'
}

const Home: NextPage = () => {
  const [ selectedWorkSpace, setSelectedWorkSpace ] = useState(workspaces.PROCESSOR)

  return (
    <>
      <MainHead />
      <Navigation />
      <MainWorkspace selectedWorkSpace={selectedWorkSpace} />
    </>
  )
}

export default Home

