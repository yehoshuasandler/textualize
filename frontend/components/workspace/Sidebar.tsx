'use client'

import React, { useRef, useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { ipc } from '../../wailsjs/wailsjs/go/models'
import { useProject } from '../../context/Project/provider'

type NavigationItem = {
  id: string,
  name: string,
  children: { id: string, name: string }[]
}

const getNavigationProps = (documents: ipc.Document[], groups: ipc.Group[]): NavigationItem[] => {
  const groupsWithDocuments = groups.map(g => {
    const childrenDocuments = documents
      .filter(d => d.groupId === g.id)
      .map(d => ({ id: d.id, name: d.name }))

    return {
      id: g.id,
      name: g.name,
      children: childrenDocuments
    }
  })

  const documentsWithoutGroup = documents
    .filter(d => !d.groupId || d.groupId === 'Uncategorized')
    .map(d => ({ id: d.id, name: d.name }))

  return [
    ...groupsWithDocuments,
    {
      id: 'Uncategorized',
      name: 'Uncategorized',
      children: documentsWithoutGroup
    }
  ]
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function Sidebar() {
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [isAddNewDocumentInputShowing, setIsAddNewDocumentInputShowing] = useState(false)
  const [isAddNewGroupInputShowing, setIsAddNewGroupInputShowing] = useState(false)
  const addDocumentTextInput = useRef<HTMLInputElement>(null)
  const addGroupTextInput = useRef<HTMLInputElement>(null)

  const {
    documents,
    groups,
    requestAddDocument,
    requestAddDocumentGroup,
    selectedDocumentId,
    setSelectedDocumentId
  } = useProject()

  const navigation = getNavigationProps(documents, groups)

  const getParentGroupIdFromItemId = (itemId: string) => {
    let parentGroupId = ''
    navigation.forEach(n => {
      const foundItem = n.children.find(c => c.id === itemId)
      if (foundItem) parentGroupId = n.id
    })
    return parentGroupId
  }

  const onAddNewDocumentLineItemClickHandler = (groupId: string) => {
    setSelectedGroupId(groupId)
    setIsAddNewDocumentInputShowing(true)
    setIsAddNewGroupInputShowing(false)
  }

  const onAddNewGroupLineItemClickHandler = () => {
    setIsAddNewGroupInputShowing(true)
    setIsAddNewDocumentInputShowing(false)
  }

  const onItemClickHandler = (itemId: string) => {
    setSelectedDocumentId(itemId)
    setSelectedGroupId(getParentGroupIdFromItemId(itemId))
    setIsAddNewDocumentInputShowing(false)
    setIsAddNewGroupInputShowing(false)
  }

  const onCancelAddGroupClickHandler = () => {
    setIsAddNewGroupInputShowing(false)
  }

  const onCancelAddItemClickHandler = () => {
    setIsAddNewDocumentInputShowing(false)
  }

  const onConfirmAddDocumentClickHandler = async (groupId: string) => {
    const documentName = addDocumentTextInput.current?.value
    if (!documentName) return

    const response = await requestAddDocument(groupId, documentName)
    if (!response.id) return

    setSelectedDocumentId(response.id)
    setSelectedGroupId(groupId)
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

  const onEnterHandler = (event: React.KeyboardEvent<HTMLInputElement>, callback: Function) => {
    if (event.key === 'Enter') callback()
  }

  const renderAddGroupInput = () => {
    return isAddNewGroupInputShowing
      ? <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10 text-lg">
          <input
            type="text"
            name="groupName"
            id="groupName"
            autoFocus
            className="text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 block w-full rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

  const renderAddNewDocument = (groupId: string) => {
    return isAddNewDocumentInputShowing && selectedGroupId === groupId
      ? <div className="flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10 text-lg">
          <input
            type="text"
            name="documentName"
            id="documentName"
            className="text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 block w-full rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Add Document"
            autoFocus
            onKeyDown={(event) => {
              onEnterHandler(event,
              () => onConfirmAddDocumentClickHandler(groupId))
            }}
            ref={addDocumentTextInput}
          />
        </div>
        <button
          type="button"
          onClick={onCancelAddItemClickHandler}
          className="bg-gray-900 bg-opacity-5 relative -ml-px inline-flex items-center space-x-2 border border-gray-400  px-1 py-0 text-sm font-medium text-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <XMarkIcon className="h-4 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onConfirmAddDocumentClickHandler(groupId)}
          className="bg-gray-900 bg-opacity-5 relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-400  px-1 py-0 text-sm font-medium text-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <PlusIcon className="h-7 w-5" aria-hidden="true" />
        </button>
      </div>
      : <a
        role='button'
        className={classNames(
          'text-gray-300 hover:bg-gray-700 hover:text-white',
          ' group w-full flex items-center pr-2 py-2 text-left font-medium',
          'text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2'
        )}
        onClick={() => onAddNewDocumentLineItemClickHandler(groupId)}
      >
        <PlusIcon className="h-3 w-4" aria-hidden="true" />
        Add Document
      </a>
  }

  const renderNavigationItems = () => (
    <nav className="flex-1 space-y-1 px-2 py-4" aria-label='Sidebar'>

      {renderAddGroupInput()}

      {navigation.map((item) =>
        <details key={item.name} open={item.id === selectedGroupId}>
          <summary className={classNames(
            item.id === selectedGroupId
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'group items-center px-2 py-2 text-base font-medium rounded-md'
          )}>
            <a role='button'>{item.name}</a>
          </summary>
          <ul>
            {item.children.map(child => (
              <li key={child.id}>
                <a
                  role='button'
                  onClick={() => onItemClickHandler(child.id)}
                  className={classNames(
                    child.id === selectedDocumentId
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'group w-full flex items-center pr-2 py-2 text-left font-medium text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2'
                  )}
                >
                  {child.name}
                </a>
              </li>
            ))}

            {renderAddNewDocument(item.id)}
          </ul>
        </details>
      )}
    </nav>
  )

  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800 bg-opacity-25">
          <div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4 bg-opacity-25">
            <img
              className="h-8 w-auto"
              src='/images/logo.svg'
              alt="Textualize"
            />
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            {renderNavigationItems()}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
