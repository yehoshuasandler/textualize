'use client'

import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, FolderArrowDownIcon, FolderOpenIcon, FolderPlusIcon } from '@heroicons/react/20/solid'
import { Fragment, useState } from 'react'
import { useProject } from '../../context/Project/provider'
import NewProjectModal from './NewProjectModal'


const MainProject = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [canPopoverBeOpen, setCanPopoverBeOpen] = useState(true)
  const { createNewProject } = useProject()

  const buttonOptions = [
    {
      name: 'New',
      description: 'Create a new Project',
      icon: <FolderPlusIcon className='w-10 h-10 stroke-slate-600' />,
      onClick: () => {
        setIsNewProjectModalOpen(true)
        setCanPopoverBeOpen(false)
      },
    },
    {
      name: 'Open',
      description: 'Open a local Project',
      icon: <FolderOpenIcon className='w-10 h-9 stroke-slate-600' />,
      onClick: () => {
        setCanPopoverBeOpen(false)
      },
    },
    {
      name: 'Connect',
      description: 'Connected to a hosted Project',
      icon: <FolderArrowDownIcon className='w-10 h-9 stroke-slate-600' />,
      onClick: () => {
        setCanPopoverBeOpen(false)
      },
    },
  ]

  const onCreateNewProjectHandler = (projectName: string) => {
    setIsNewProjectModalOpen(false)
    setCanPopoverBeOpen(true)
    createNewProject(projectName)
  }

  return <main className=" text-gray-100 h-screen overflow-y-scroll">

    {isNewProjectModalOpen ? <NewProjectModal onCreateNewProjectHandler={onCreateNewProjectHandler} /> : ''}

    <div className="py-20 px-6 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">

        <div>
          <img
            className=" h-10 inline-block"
            src='/images/logo.svg'
            alt="T"
          />
          <h3 className="inline-block">extualize</h3>
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-gray-200">
          Digitize, Translate, and Manage
          <br />
          Your Physical Documents
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur
          commodo do ea.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Popover className="relative">
            {({ open }) => <>
              <Popover.Button
                className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span>Select Project</span>
                <ChevronDownIcon
                  className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-orange-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                  aria-hidden="true"
                />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                {canPopoverBeOpen ? (
                  <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-[420px] -translate-x-1/2 transform px-4 sm:px-0">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative bg-white py-7">
                        {buttonOptions.map((item) => (
                          <a
                            key={item.name}
                            onClick={item.onClick}
                            className="cursor-pointer -m-3 flex w-[400px] mx-auto text-left rounded-lg py-2 px-8 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          >
                            <div className=" text-white sm:h-12 sm:w-12">
                              {item.icon}
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className="bg-gray-50 p-4">
                        <a
                          href="##"
                          className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <span className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              Documentation
                            </span>
                          </span>
                          <span className="block text-sm text-gray-500">
                            Start integrating products and tools
                          </span>
                        </a>
                      </div>
                    </div>
                  </Popover.Panel>
                ) : <Popover.Panel></Popover.Panel>
                }
              </Transition>
            </>
            }
          </Popover>
          <a href="#" className="text-base font-semibold leading-7 text-gray-400">
            Learn More <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </main>
}

export default MainProject
