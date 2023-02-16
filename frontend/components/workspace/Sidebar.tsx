'use client'

import React, { useRef, useState } from 'react'
import { PlusIcon, XMarkIcon, DocumentPlusIcon } from '@heroicons/react/20/solid'
import { ipc } from '../../wailsjs/wailsjs/go/models'
import { useProject } from '../../context/Project/provider'

type GroupNavigationItem = {
  id: string,
  name: string,
  documents: {
    id: string,
    name: string,
    areas: { id: string, name: string }[]
  }[]
}

const getNavigationProps = (documents: ipc.Document[], groups: ipc.Group[]): GroupNavigationItem[] => {
  const groupsWithDocuments = groups.map(g => {
    const childrenDocuments = documents
      .filter(d => d.groupId === g.id)
      .map(d => ({
        id: d.id,
        name: d.name,
        areas: d.areas.map(a => ({ id: a.id, name: a.name }))
      }))

    return {
      id: g.id,
      name: g.name,
      documents: childrenDocuments
    }
  })

  const documentsWithoutGroup = documents
    .filter(d => !d.groupId || d.groupId === 'Uncategorized')
    .map(d => ({
      id: d.id,
      name: d.name,
      areas: d.areas.map(a => ({ id: a.id, name: a.name }))
    }))

  return [
    ...groupsWithDocuments,
    {
      id: 'Uncategorized',
      name: 'Uncategorized',
      documents: documentsWithoutGroup
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
  const [isEditAreaNameInputShowing, setIsEditAreaNameInputShowing] = useState(false)
  const addDocumentTextInput = useRef<HTMLInputElement>(null)
  const addGroupTextInput = useRef<HTMLInputElement>(null)
  const editAreaNameTextInput = useRef<HTMLInputElement>(null)

  const {
    documents,
    groups,
    getAreaById,
    requestUpdateArea,
    requestAddDocument,
    requestAddDocumentGroup,
    selectedAreaId,
    setSelectedAreaId,
    selectedDocumentId,
    setSelectedDocumentId,
    currentSession,
  } = useProject()

  const navigation = getNavigationProps(documents, groups)

  const getGroupIdFromDocumentId = (itemId: string) => {
    let groupId = ''
    navigation.forEach(g => {
      const foundDocument = g.documents.find(d => d.id === itemId)
      if (foundDocument) groupId = g.id
    })
    return groupId
  }

  const getDocumentIdFromAreaId = (areaId: string) => {
    let documentId = ''
    navigation.map(g => g.documents).flat().forEach(d => {
      const doesDocumentIncludeArea = d.areas.map(a => a.id).includes(areaId)
      if (doesDocumentIncludeArea) documentId = d.id
    })

    return documentId
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

  const onAreaClick = (areaId: string) => {
    getDocumentIdFromAreaId(areaId)
    setSelectedDocumentId(getDocumentIdFromAreaId(areaId) || '')
    setSelectedAreaId(areaId)
  }

  const onAreaDoubleclick = (areaId: string) => {
    const documentIdOfArea = getDocumentIdFromAreaId(areaId)
    setIsEditAreaNameInputShowing(true)
    console.log('double click')
  }

  const onAreaInputBlur = () => {
    setIsEditAreaNameInputShowing(false)
  }

  const onDocumentClickHandler = (itemId: string) => {
    setSelectedDocumentId(itemId)
    setSelectedGroupId(getGroupIdFromDocumentId(itemId))
    setIsAddNewDocumentInputShowing(false)
    setIsAddNewGroupInputShowing(false)
  }

  const onCancelAddGroupClickHandler = () => {
    setIsAddNewGroupInputShowing(false)
  }

  const onCancelAddItemClickHandler = () => {
    setIsAddNewDocumentInputShowing(false)
  }

  const onConfirmAreaNameChangeHandler = async (areaDetails: { areaId: string, areaName: string }) => {
    const { areaId, areaName } = areaDetails

    const areaToUpdate = getAreaById(areaId)
    if (areaToUpdate) {
      areaToUpdate.name = areaName
      requestUpdateArea(areaToUpdate)
        .then(response => console.log(response))
        .catch(console.error)
    }
    setIsEditAreaNameInputShowing(false)
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

  const renderAddNewDocument = (groupId: string) => {
    return isAddNewDocumentInputShowing && selectedGroupId === groupId
      ? <div className="flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10 text-lg">
          <input
            type="text"
            name="documentName"
            id="documentName"
            className="h-8 text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 block w-full rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          ' group w-full flex items-center pl-5 py-2 text-left font-medium',
          'text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
        )}
        onClick={() => onAddNewDocumentLineItemClickHandler(groupId)}
      >
        <DocumentPlusIcon className="h-3.5 mr-1" aria-hidden="true" />
        Add Document
      </a>
  }

  const renderNavigationItems = () => (
    <nav className="flex-1 space-y-1 px-2 py-4" aria-label='Sidebar'>

      {renderAddGroupInput()}

      {navigation.map((group) =>
        <details key={group.name} open={group.id === selectedGroupId}>
          <summary className={classNames(
            group.id === selectedGroupId
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'group items-center px-2 py-2 text-base font-medium rounded-t-md'
          )}>
            <a role='button'>{group.name}</a>
          </summary>
          <ul>
            {group.documents.map((d, index) => (
              <li className='p-0 m-0' key={d.id}>
                {!d.areas.length
                  ? <div
                    onClick={() => onDocumentClickHandler(d.id)}
                    className={classNames(
                      d.id === selectedDocumentId
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'group items-center py-2 text-base font-medium rounded-b-md pl-10',
                      index !== 0 ? 'rounded-t-md' : '',
                    )}>
                    <a
                      role='button'
                      className={classNames(
                        d.id === selectedDocumentId
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'text-left font-medium text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 '
                      )}
                    >
                      {d.name}
                    </a>
                  </div>
                  : <details>
                    <summary
                      onClick={() => onDocumentClickHandler(d.id)}
                      className={classNames(
                        d.id === selectedDocumentId
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'group items-center py-2 text-base font-medium rounded-b-md pl-6',
                        index !== 0 ? 'rounded-t-md' : '',

                      )}>
                      <a
                        role='button'
                        className={classNames(
                          d.id === selectedDocumentId
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'text-left font-medium text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 '
                        )}
                      >
                        {d.name}
                      </a>
                    </summary>
                    <ul>
                      {d.areas.map((a, index) => (
                        <li key={a.id}>
                          {selectedAreaId === a.id && isEditAreaNameInputShowing
                            ? <input
                              type="text"
                              name="areaName"
                              id="areaName"
                              autoFocus
                              className="h-8 text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 block w-full rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder={a.name || `Area ${index + 1}`}
                              onBlur={onAreaInputBlur}
                              onKeyDown={(event) => {
                                onEnterHandler(event,
                                  () => onConfirmAreaNameChangeHandler({ areaId: a.id, areaName: event.currentTarget.value }))
                              }}
                              ref={editAreaNameTextInput}
                            />
                            : <a
                              role='button'
                              onClick={() => onAreaClick(a.id)}
                              onDoubleClick={() => onAreaDoubleclick(a.id)}
                              className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white',
                                'group w-full flex items-center pr-2 py-2 text-left font-medium pl-8 text-xs',
                                'rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 py-2 select-none',
                                selectedAreaId === a.id ? 'underline' : ''
                              )}
                            >
                              {a.name || `Area ${index + 1}`}
                            </a>
                          }
                        </li>
                      ))}
                    </ul>
                  </details>
                }
              </li>
            ))}

            {renderAddNewDocument(group.id)}
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
            <img className="h-8 w-auto" src='/images/logo.svg' alt="Textualize" />
            <h1 className='text-gray-100 text-xl ml-2'>{currentSession.project.name}</h1>
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
