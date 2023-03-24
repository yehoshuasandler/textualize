export type SidebarContextType = {
  navigationProps: SidebarGroup[],
  selectedGroupId: string,
  setSelectedGroupId: (_: string) => void,
  selectedDocumentId: string,
  setSelectedDocumentId: (_: string) => void,
  selectedAreaId: string,
  setSelectedAreaId: (_: string) => void,
  isAddNewDocumentInputShowing: boolean,
  setIsAddNewDocumentInputShowing: (_: boolean) => void,
  isEditDocumentNameInputShowing: boolean,
  setIsEditDocumentNameInputShowing: (_: boolean) => void,
  isAddNewGroupInputShowing: boolean,
  setIsAddNewGroupInputShowing: (_: boolean) => void,
  isEditAreaNameInputShowing: boolean,
  setIsEditAreaNameInputShowing: (_: boolean) => void,
}

export type SidebarArea = {
  id: string,
  name: string,
  order: number
}

export type SidebarDocument = {
  id: string,
  name: string,
  areas: SidebarArea[]
}

export type SidebarGroup = {
  id: string,
  name: string,
  documents: SidebarDocument[]
}