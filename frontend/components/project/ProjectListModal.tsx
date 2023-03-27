import { ipc } from '../../wailsjs/wailsjs/go/models'

type Props = { projects: ipc.Project[], onSelectProjectHandler: (projectName: string) => void }
const ProjectListModal = (props: Props) => {

  return (
    <div className=" p-8 absolute top-2/4 -translate-y-1/2 left-2/4 -translate-x-1/2 z-50 bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900">Select your Existing Project</h3>
        <div className="mt-6 flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {props.projects.map((p) => (
              <li key={p.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {/* <img className="h-8 w-8 rounded-full" src={p.imageUrl} alt="" /> */}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-xl text-gray-900 font-bold">{p.name}</h2>
                    <p className="truncate text-xs text-gray-400">{'id: ' + p.id}</p>
                  </div>
                  <div>
                    <a
                      href="#"
                      onClick={() => props.onSelectProjectHandler(p.name)}
                      className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Open
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          {/* <a
            href="#"
            className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
          >
            View all
          </a> */}
        </div>
      </div>
    </div>
  )
}

export default ProjectListModal
