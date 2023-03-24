
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useRef } from 'react'
import { useProject } from '../../../context/Project/provider'
import classNames from '../../../utils/classNames'
import onEnterHandler from '../../../utils/onEnterHandler'
import { useSidebar } from './provider'

const AddGroupInput = () => {
  const { requestAddDocumentGroup } = useProject()
  const {
    isAddNewGroupInputShowing,
    setSelectedGroupId,
    setIsAddNewGroupInputShowing,
    setIsAddNewDocumentInputShowing
   } = useSidebar()

  const addGroupTextInput = useRef<HTMLInputElement>(null)


  const onAddNewGroupLineItemClickHandler = () => {
    setIsAddNewGroupInputShowing(true)
    setIsAddNewDocumentInputShowing(false)
  }

  const onConfirmAddGroupClickHandler = async (e: React.MouseEvent) => {
    const groupName = addGroupTextInput.current?.value
    if (!groupName) return

    const response = await requestAddDocumentGroup(groupName)
    if (!response.id) return

    setSelectedGroupId(response.id)
    setIsAddNewGroupInputShowing(false)
  }

  const onCancelAddGroupClickHandler = () => {
    setIsAddNewGroupInputShowing(false)
  }

  return isAddNewGroupInputShowing
    ? <div className="mt-1 flex rounded-md shadow-sm">
      <div className="relative flex flex-grow items-stretch focus-within:z-10 text-lg">
        <input
          type="text"
          name="groupName"
          id="groupName"
          autoFocus
          className="h-8 text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 block w-full rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Add Group"
          onKeyDown={(event) => {
            onEnterHandler(event,
              onConfirmAddGroupClickHandler)
          }}
          ref={addGroupTextInput}
        />
      </div>
      <button
        type="button"
        onClick={onCancelAddGroupClickHandler}
        className="bg-gray-900 bg-opacity-5 relative -ml-px inline-flex items-center space-x-2 border border-gray-400  px-1 py-0 text-sm font-medium text-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <XMarkIcon className="h-4 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onConfirmAddGroupClickHandler}
        className="bg-gray-900 bg-opacity-5 relative -ml-px inline-flex items-center space-x-2 border border-gray-400  px-1 py-0 text-sm font-medium text-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <PlusIcon className="h-4 w-5" aria-hidden="true" />
      </button>
    </div>
    : <a
      role='button'
      className={classNames(
        'text-gray-300 hover:bg-gray-700 hover:text-white',
        ' group w-full flex items-center pr-2 py-2 text-left font-medium',
        'text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2'
      )}
      onClick={onAddNewGroupLineItemClickHandler}
    >
      <PlusIcon className="h-5 w-4" aria-hidden="true" />
      Add Group
    </a>
}


export default AddGroupInput
