enum workspaces {
  PROCESSOR = 'PROCESSOR',
  TEXTEDITOR = 'TEXTEDITOR',
  TRANSLATOR = 'TRANSLATOR',
  DETAILS = 'DETAILS',
}

export { workspaces }

export type NavigationContextType = {
  selectedWorkspace: workspaces,
  setSelectedWorkspace: (workspace: workspaces) => void
}

export type NavigationProps = {
  selectedWorkspace: workspaces
}
