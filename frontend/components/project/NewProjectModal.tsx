import { useRef } from 'react'

type Props = {
  onCreateNewProjectHandler: (projectName: string) => void
}

const NewProjectModal = (props: Props) => {
  const projectNameRef = useRef<HTMLInputElement>(null)

  return (
    <div className=" p-8 absolute top-2/4 -translate-y-1/2 left-2/4 -translate-x-1/2 z-50 bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Name Your New Project</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>A unique name will be best. This <b>can</b> be changed later.</p>
        </div>
        <form className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="name" className="sr-only">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoFocus
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
              placeholder="New Project"
              ref={projectNameRef}
            />
          </div>
          <button
            type="submit"
            onClick={() => {
              if (!projectNameRef.current?.value) return
              props.onCreateNewProjectHandler(projectNameRef.current?.value)
            }}
            className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Start
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewProjectModal
