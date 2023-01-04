import { NextPage } from 'next'
import MainHead from '../components/head'
import MainWorkspace from '../components/workspace/Main'
import Navigation from '../components/workspace/Navigation'

const Home: NextPage = () => {
  return (
    <>
      <MainHead />
      <Navigation />
      <MainWorkspace />
    </>
  )
}

export default Home

