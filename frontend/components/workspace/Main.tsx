'use client'

import { useNavigation } from '../../context/Navigation/provider'
import { workspaces } from '../../context/Navigation/types'
import { useProject } from '../../context/Project/provider'
import DocumentRenderer from './DocumentRenderer'
import NoSelectedDocument from './NoSelectedDocument'
import TextEditor from './TextEditor'

const MainWorkspace = () => {
  const { getSelectedDocument, selectedDocumentId } = useProject()
  const { selectedWorkspace } = useNavigation()

const renderSelectedWorkSpace = () => {
  if (selectedWorkspace === workspaces.TEXTEDITOR) return <TextEditor />
  else return !selectedDocumentId ? <NoSelectedDocument /> : <DocumentRenderer />
}

  return <main className=" bg-gray-100 min-h-[calc(100vh-118px)] ml-64 overflow-y-scroll">
    <div className='flex-1'>
      <div className="py-1">
        <div className="mx-auto  px-4 sm:px-6 md:px-8">
          <div className="py-2">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                {getSelectedDocument()?.name || 'Image Processor'}
              </h1>
            </div>
            { renderSelectedWorkSpace() }
          </div>
        </div>
      </div>
    </div>
  </main>
}

export default MainWorkspace
