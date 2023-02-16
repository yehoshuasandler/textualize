import { NextPage } from 'next'
import MainHead from '../components/head'
import MainProject from '../components/project/Main'
import MainWorkspace from '../components/workspace/Main'
import Navigation from '../components/workspace/Navigation'
import { useProject } from '../context/Project/provider'

const Home: NextPage = () => {

  const { currentSession } = useProject()

  return (
    <>
      <MainHead />
      {!currentSession?.project?.id
        ? <MainProject />
        : <>
          <Navigation />
          <MainWorkspace />
        </>
      }
    </>
  )
}

export default Home

