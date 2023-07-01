'use client'

import { createContext, Fragment, ReactNode, useContext, useEffect, useState } from 'react'
import { XMarkIcon, InformationCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { NotificationContextType, NotificationProps } from './types'
import makeDefaultNotification from './makeDefaultNotification'
import { Transition } from '@headlessui/react'

const NotificationContext = createContext<NotificationContextType>(makeDefaultNotification())

export function useNotification() {
  return useContext(NotificationContext)
}

const notificationTimeInMilliseconds = 3000
const queue: NotificationProps[] = []

const renderIcon = (level: NotificationProps['level'] = 'info') => {
  switch (level) {
    default: return <InformationCircleIcon className='w-6 h-6 text-blue-400' />
    case 'info': return <InformationCircleIcon className='w-6 h-6 text-blue-400' />
    case 'warning': return <ExclamationTriangleIcon className='w-6 h-6 text-orange-400' />
    case 'error': return <ExclamationCircleIcon className='w-6 h-6 text-red-600' />
  }
}

type Props = { children: ReactNode }
export function NotificationProvider({ children }: Props) {
  const [currentNotification, setCurrentNotification] = useState<NotificationProps | undefined>()

  const addNotificationToQueue = (notificationProps: NotificationProps) => {
    if (!queue.length) {
      queue.push(notificationProps)
      setCurrentNotification(notificationProps)
    } else {
      queue.push(notificationProps)
    }
  }

  const dismissCurrentNotification = () => {
    queue.shift()
    setCurrentNotification(queue[0])
  }

  useEffect(() => {
    if (!queue.length) return
    setTimeout(dismissCurrentNotification, notificationTimeInMilliseconds)
  }, [currentNotification])

  const handleOnClick = () => {
    if (currentNotification?.onActionClickCallback) currentNotification?.onActionClickCallback()
    if (currentNotification?.closeOnAction) dismissCurrentNotification()
  }


  const value = { addNotificationToQueue }

  return <NotificationContext.Provider value={value}>
    { children }
    <>
      <div
        aria-live="assertive"
        className="pointer-events-none absolute block top-0 left-0 w-full h-full"
      >
        <div className="absolute items-center" style={{ bottom: '12px', right: '16px' }}>
          <Transition
            show={!!currentNotification}
            as={Fragment}
            enter="transform ease-out duration-1300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-center">
                  {renderIcon(currentNotification?.level)}
                  <div className="flex w-0 content-center flex-1 justify-between">
                    <p className="w-0 flex-1 text-sm font-medium text-gray-900 ml-2">{currentNotification?.message}</p>
                    {currentNotification?.actionButtonText ? <button
                      type="button"
                      className="ml-3 flex-shrink-0 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => handleOnClick()}
                    >
                      {currentNotification?.actionButtonText}
                    </button>
                      : <></>
                    }
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        dismissCurrentNotification()
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>

  </NotificationContext.Provider>
}
