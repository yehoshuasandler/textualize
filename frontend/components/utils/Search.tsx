import { Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { BellIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { useNavigation } from '../../context/Navigation/provider'
import { mainPages } from '../../context/Navigation/types'
import UserAvatar from './UserAvatar'
import classNames from '../../utils/classNames'

const Search = () => {
  const { setSelectedMainPage } = useNavigation()

  const userNavigation = [
    {
      name: 'Your Profile',
      onClick: () => { setSelectedMainPage(mainPages.EDITUSER) }
    },
    {
      name: 'Document Workspace',
      onClick: () => { setSelectedMainPage(mainPages.WORKSPACE) }
    },
    {
      name: 'Change Project',
      onClick: () => { setSelectedMainPage(mainPages.SELECTPROJECT) }
    },
    {
      name: 'Sign Out',
      onClick: () => { setSelectedMainPage(mainPages.SELECTPROJECT) }
    },
  ]

  return <div className="top-0 z-10 flex h-16 flex-shrink-0 bg-white">
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
              <UserAvatar />
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
            <Menu.Items className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                      onClick={item.onClick}
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
}

export default Search