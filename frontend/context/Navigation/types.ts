enum workspaces {
  PROCESSOR = 'PROCESSOR',
  TEXTEDITOR = 'TEXTEDITOR',
  TRANSLATOR = 'TRANSLATOR',
  DETAILS = 'DETAILS',
}

enum mainPages {
  WORKSPACE = 'WORKSPACE',
  EDITUSER = 'EDITUSER',
  SELECTPROJECT = 'SELECTPROJECT'
}

export { workspaces, mainPages }

export type NavigationContextType = {
  selectedWorkspace: workspaces,
  setSelectedWorkspace: (workspace: workspaces) => void
  selectedMainPage: mainPages
  setSelectedMainPage: (mainPage: mainPages) => void
}

export type NavigationProps = {
  selectedWorkspace: workspaces
  selectedMainPage: mainPages
}
