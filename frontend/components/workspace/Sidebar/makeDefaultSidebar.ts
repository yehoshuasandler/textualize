import { SidebarContextType } from './types'

const makeDefaultSidebar = (): SidebarContextType => ({
  navigationProps: [],
  selectedGroupId: '',
  setSelectedGroupId: (_: string) => {},
  selectedDocumentId: '',
  setSelectedDocumentId: (_: string) => {},
  selectedAreaId: '',
  setSelectedAreaId: (_: string) => {},
  isAddNewDocumentInputShowing: false,
  setIsAddNewDocumentInputShowing: (_: boolean) => {},
  isEditDocumentNameInputShowing: false,
  setIsEditDocumentNameInputShowing: (_: boolean) => {},
  isAddNewGroupInputShowing: false,
  setIsAddNewGroupInputShowing: (_: boolean) => {},
  isEditAreaNameInputShowing: false,
  setIsEditAreaNameInputShowing: (_: boolean) => {},
})

export default makeDefaultSidebar