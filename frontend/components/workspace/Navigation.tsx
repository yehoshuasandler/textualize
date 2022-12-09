'use client'

import React, { Fragment, useRef, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon, PlusIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { GetDocuments, RequestAddDocument, RequestAddDocumentGroup } from '../../wailsjs/wailsjs/go/ipc/Channel'
import { LogPrint } from '../../wailsjs/wailsjs/runtime/runtime'
import { ipc } from '../../wailsjs/wailsjs/go/models'

type NavigationItem = {
  id: string,
  name: string,
  children: { id: string, name: string }[]
}

const userNavigation = [
  { name: 'Your Profile' },
  { name: 'Settings' },
  { name: 'Sign out' },
]

const getNavigationProps = (documentsAndGroups: ipc.GetDocumentsResponse): NavigationItem[] => {
  const { documents, documentGroups } = documentsAndGroups

  const groupsWithDocuments = documentGroups.map(g => {
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

const initDocumentsAndGroups = new ipc.GetDocumentsResponse({ documents: [], documentGroups: [] })

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function WorkspaceNavigation() {
  const [selectedItemId, setSelectedItemId] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [isAddNewDocumentInputShowing, setIsAddNewDocumentInputShowing] = useState(false)
  const [isAddNewGroupInputShowing, setIsAddNewGroupInputShowing] = useState(false)
  const [documentsAndGroups, setDocumentsAndGroups] = useState(initDocumentsAndGroups)
  const addDocumentTextInput = useRef<HTMLInputElement>(null)
  const addGroupTextInput = useRef<HTMLInputElement>(null)


  const navigation = getNavigationProps(documentsAndGroups)

  const updateDocuments = async () => {
    GetDocuments().then(response => {
      LogPrint(JSON.stringify(response, null, 2))
      setDocumentsAndGroups(response)
      Promise.resolve(response)
    })
  }

  if (!documentsAndGroups.documents.length
    || !documentsAndGroups.documentGroups.length) {
    updateDocuments()
  }


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
    setSelectedItemId(itemId)
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

    const response = await RequestAddDocument(groupId, documentName)
    if (!response.id) return

    let newDocumentsAndGroups = new ipc.GetDocumentsResponse(documentsAndGroups)
    newDocumentsAndGroups.documents.push(response)
    setDocumentsAndGroups(newDocumentsAndGroups)
    setSelectedItemId(response.id)
    setSelectedGroupId(groupId)
    setIsAddNewDocumentInputShowing(false)
  }

  const onConfirmAddGroupClickHandler = async(e: React.MouseEvent) => {
    const groupName = addGroupTextInput.current?.value
    if (!groupName) return

    const response = await RequestAddDocumentGroup(groupName)
    if (!response.id) return

    let newDocumentsAndGroups = new ipc.GetDocumentsResponse(documentsAndGroups)
    newDocumentsAndGroups.documentGroups.push(response)
    setDocumentsAndGroups(newDocumentsAndGroups)
    setSelectedGroupId(response.id)
    setIsAddNewGroupInputShowing(false)
  }

  const renderAddGroupInput = () => {
    return isAddNewGroupInputShowing
      ? <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10 text-lg">
          <input
            type="text"
            name="groupName"
            id="groupName"
            className="text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 block w-full rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Add Group"
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
                    child.id === selectedItemId
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
        {/* Sidebar component */}
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
      <div className="flex flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <form className="flex w-full md:ml-0" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                  />
                </div>
              </form>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <a
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkspaceNavigation
