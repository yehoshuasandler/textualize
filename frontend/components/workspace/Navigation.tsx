'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { GetDocuments } from '../../wailsjs/wailsjs/go/ipc/Channel'
import { LogPrint } from '../../wailsjs/wailsjs/runtime/runtime'
import { ipc } from '../../wailsjs/wailsjs/go/models'

type NavigationItem = {
  id: string,
  name: string,
  children: { id: string, name: string }[]
}

// const navigation: NavigationItem[] = [
//   {
//     id: uuidv4(),
//     name: 'Chapter One',
//     children: [
//       { name: 'Overview', id: uuidv4() },
//       { name: 'Members', id: uuidv4() },
//       { name: 'Calendar', id: uuidv4() },
//       { name: 'Settings', id: uuidv4() },
//     ],
//   },
// ]

const userNavigation = [
  { name: 'Your Profile' },
  { name: 'Settings' },
  { name: 'Sign out' },
]

const getNavigationProps = (
  documents: ipc.Document[],
  documentGroups: ipc.DocumentGroup[]): NavigationItem[] => {
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
      .filter(d => !d.groupId)
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

function WorkspaceNavigation () {
  const [selectedItemId, setSelectedItemId] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [documents, setDocuments] = useState([] as ipc.Document[])
  const [documentGroups, setDocumentGroups] = useState([] as ipc.DocumentGroup[])
  const [navigation, setNavigation] = useState([] as NavigationItem[])

  useEffect(() => {
    setNavigation(getNavigationProps(documents, documentGroups))
  }, [documents, documentGroups])

  GetDocuments().then(response => {
    LogPrint(JSON.stringify(response, null, 2))
    if (!documents.length) setDocuments(response.documents)
    if (!documentGroups.length) setDocumentGroups(response.documentGroups)
  })


  const getParentGroupIdFromItemId = (itemId: string) => {
    let parentGroupId = ''
    navigation.forEach(n => {
      const foundItem = n.children.find(c => c.id === itemId)
      if (foundItem) parentGroupId = n.id
    })
    return parentGroupId
  }

  const onItemClickHandler = (itemId: string) => {
    setSelectedItemId(itemId)
    setSelectedGroupId(getParentGroupIdFromItemId(itemId))
  }

  const renderNavigationItems = () => (
    <nav className="flex-1 space-y-1 px-2 py-4" aria-label='Sidebar'>
      <div>
        <a
          role='button'
          onClick={() => console.log('Add Group')}
          className={classNames(
            'text-gray-300 hover:bg-gray-700 hover:text-white',
            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
          )}
        >
          Add New Group
        </a>
      </div>

      {navigation.map((item) =>
        <details key={item.name} open={item.id === selectedGroupId}>
          <summary className={classNames(
                item.id === selectedGroupId
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'group items-center px-2 py-2 text-base font-medium rounded-md'
              )}>
            <a role='button'>
              {item.name}
            </a>
          </summary>
          <ul>
            {item.children.map(child => (
              <li key={child.id}>
                <a
                role='button'
                className={classNames(
                  child.id === selectedItemId
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group w-full flex items-center pr-2 py-2 text-left font-medium text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2'
                )}
                onClick={() => onItemClickHandler(child.id)}
                >
                  { child.name }
                </a>
              </li>
            ))}

            <li>
              <a
              role='button'
              className={classNames(
                'text-gray-300 hover:bg-gray-700 hover:text-white',
              ' group w-full flex items-center pr-2 py-2 text-left font-medium',
              'text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2'
              )}
              onClick={() => console.log('Add New Item')}
              >
                Add New Document
              </a>
            </li>
          </ul>
        </details>
      )}
    </nav>
  )

  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
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
