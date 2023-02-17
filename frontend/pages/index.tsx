import { NextPage } from 'next'
import { useEffect } from 'react'
import MainHead from '../components/head'
import MainProject from '../components/project/Main'
import User from '../components/settings/User'
import MainWorkspace from '../components/workspace/Main'
import Navigation from '../components/workspace/Navigation'
import { useNavigation } from '../context/Navigation/provider'
import { mainPages } from '../context/Navigation/types'
import { useProject } from '../context/Project/provider'

const Home: NextPage = () => {

  const { currentSession } = useProject()
  const { selectedMainPage, setSelectedMainPage } = useNavigation()

  useEffect(() => {
    if (!currentSession?.user?.localId) setSelectedMainPage(mainPages.EDITUSER)
    else if (!currentSession?.project?.id) setSelectedMainPage(mainPages.SELECTPROJECT)
  },)

  const renderSelectedMainPage = () => {
    if (selectedMainPage === mainPages.SELECTPROJECT) return <MainProject />
    else if (selectedMainPage === mainPages.EDITUSER) return <User />
    else if ((selectedMainPage === mainPages.WORKSPACE) && currentSession?.project?.id) {
      return <>
      <Navigation />
      <MainWorkspace />
    </>
    }
    else return <MainProject />
  }

  return (
    <>
      <MainHead />
      { renderSelectedMainPage() }
    </>
  )
}

export default Home

