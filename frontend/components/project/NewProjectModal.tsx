import { Switch } from '@headlessui/react'
import { useRef, useState } from 'react'
import classNames from '../../utils/classNames'


type Props = {
  onCreateNewProjectHandler: (projectName: string) => void
}

const NewProjectModal = (props: Props) => {
  const projectNameRef = useRef<HTMLInputElement>(null)
  const [isHostedProjectSelected, setIsHostedProjectSelected] = useState(false)

  return (
    <div className=" p-8 absolute top-2/4 -translate-y-1/2 left-2/4 -translate-x-1/2 z-50 bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Name Your New Project</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>A unique name makes the project easier to identify later. This <b>can</b> be changed later.</p>
        </div>
        <form className="mt-3 items-center">
          <div className="w-full  mb-5">
            <label htmlFor="name" className="sr-only">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoFocus
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
              placeholder="Project Name"
              ref={projectNameRef}
            />
          </div>

          <Switch.Group as="div" className="flex items-center justify-between  mb-5">
            <span className="flex flex-grow flex-col">
              <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                Hosted Project
              </Switch.Label>
              <Switch.Description as="span" className="text-sm text-gray-500">
                A hosted project can store and process data on a server. This <b>can</b> be added later. <em className='text-xs'>Currently unavalible</em>
              </Switch.Description>
            </span>
            <Switch
              checked={isHostedProjectSelected}
              onChange={setIsHostedProjectSelected}
              disabled
              className={classNames(
                isHostedProjectSelected ? 'bg-indigo-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  isHostedProjectSelected ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </Switch.Group>

          <button
            type="submit"
            onClick={() => {
              if (!projectNameRef.current?.value) return
              props.onCreateNewProjectHandler(projectNameRef.current?.value)
            }}
            className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Start
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewProjectModal
