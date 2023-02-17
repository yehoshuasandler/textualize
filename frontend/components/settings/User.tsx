import Search from '../utils/Search'
import { useProject } from '../../context/Project/provider'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import UserAvatar from '../utils/UserAvatar'
import { useRef, useState } from 'react'
import { useNavigation } from '../../context/Navigation/provider'
import { mainPages } from '../../context/Navigation/types'

const User = () => {
  const { currentSession, requestUpdateCurrentUser, requestChooseUserAvatar } = useProject()
  const { setSelectedMainPage } = useNavigation()

  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const [avatarPath, setAvatarPath] = useState(currentSession?.user?.avatarPath || '')

  const onSaveButtonClickHandler = async () => {
    await requestUpdateCurrentUser({
      localId: currentSession?.user?.localId,
      firstName: firstNameRef?.current?.value,
      lastName: lastNameRef?.current?.value,
      email: emailRef?.current?.value,
      avatarPath: avatarPath || ''
    })
    setSelectedMainPage(mainPages.WORKSPACE)
  }

  const onAvatarSelectButtonClickHandler = async () => {
    const chosenAvatarPath = await requestChooseUserAvatar()
    setAvatarPath(chosenAvatarPath)
  }

  const onAvatarRemoveButtonClickHandler = () => {
    setAvatarPath('')
  }

  return <main className="flex-1 bg-gray-50 min-h-screen">
    <Search />
    <div className="relative mx-auto max-w-4xl md:px-8 xl:px-0">
      <div className="pt-10 pb-16">
        <div className="px-4 sm:px-6 md:px-0">
          <div className="py-6">

            <div className="mt-10 divide-y divide-gray-200">
              <div className="space-y-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                <p className="max-w-2xl text-sm text-gray-500">
                  This information will be stored in a database if connected to a hosted account. 
                  <br />
                  <em className='text-xs'>For a local user on this machine, you may save without adding any user details.</em>
                </p>
              </div>
              <div className="mt-6">
                <dl className="divide-y divide-gray-200">

                  {/* ----- Name ----- */}
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0 items-center">
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        placeholder='First Name'
                        defaultValue={currentSession?.user?.firstName}
                        ref={firstNameRef}
                        className="mr-2 mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="given-name"
                        placeholder='Last Name'
                        defaultValue={currentSession?.user?.lastName}
                        ref={lastNameRef}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                      />
                    </dd>
                  </div>
                  {/* ----- Avatar ----- */}
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                    <dt className="text-sm font-medium text-gray-500">Avatar</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <span className="flex-grow">
                        <UserAvatar overrideImagePath={avatarPath} />
                      </span>
                      <span className="ml-4 flex flex-shrink-0 items-start space-x-4">
                        <button
                          type="button"
                          className="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                          onClick={() => onAvatarSelectButtonClickHandler()}
                        >
                          Select Image
                        </button>
                        <span className="text-gray-300" aria-hidden="true">
                          |
                        </span>
                        <button
                          type="button"
                          className="rounded-md bg-white font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                          onClick={() => onAvatarRemoveButtonClickHandler()}
                        >
                          Remove
                        </button>
                      </span>
                    </dd>
                  </div>
                  {/* ----- Email ----- */}
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0 items-center relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="you@example.com"
                        defaultValue={currentSession?.user?.email}
                        ref={emailRef}
                      />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() =>  onSaveButtonClickHandler()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>
}

export default User
