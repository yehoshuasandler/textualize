'use client'

import { useProject } from "../../context/Project/provider"
import DocumentRenderer from "./DocumentRenderer"

const MainWorkspace = () => {
  const { getSelectedDocument } = useProject()

  return <main className=" bg-gray-100 min-h-[calc(100vh-4rem)] ml-64 ">
    <div className='flex-1'>
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            { getSelectedDocument()?.name }
          </h1>
        </div>
        <div className="mx-auto  px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className=" min-h-96 border-4 border-dashed border-gray-200">
              <DocumentRenderer />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
}

export default MainWorkspace
