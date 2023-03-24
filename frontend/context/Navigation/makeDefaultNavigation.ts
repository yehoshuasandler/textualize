import { mainPages, NavigationContextType, workspaces } from './types'

const makeDefaultNavigation = (): NavigationContextType => ({
  selectedWorkspace: workspaces.PROCESSOR,
  setSelectedWorkspace: (_) => {},
  selectedMainPage: mainPages.EDITUSER,
  setSelectedMainPage: (_) => {},
})

export default makeDefaultNavigation
