'use client'

import { useProject } from '../../context/Project/provider'
import DocumentRenderer from './DocumentRenderer'
import NoSelectedDocument from './NoSelectedDocument'

const MainWorkspace = () => {
  const { getSelectedDocument, selectedDocumentId } = useProject()
  

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
            {!selectedDocumentId
              ? <NoSelectedDocument />
              : <DocumentRenderer />
            }
          </div>
        </div>
      </div>
    </div>
  </main>
}

export default MainWorkspace
