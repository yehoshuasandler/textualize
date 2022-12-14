import 'server-only'
import MainHead from '../components/MainHead'
import MainWorkspace from '../components/workspace/Main'
import Navigation from '../components/workspace/Navigation'

export default function Home() {
  return (
    <>
      <MainHead />
      <Navigation />
      <MainWorkspace />
    </>
  )
}
