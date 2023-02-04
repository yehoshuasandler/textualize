import { NavigationContextType, workspaces } from './types'

const makeDefaultNavigation = (): NavigationContextType => ({
  selectedWorkspace: workspaces.PROCESSOR,
  setSelectedWorkspace: (workspace) => {}
})

export default makeDefaultNavigation
