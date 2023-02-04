import { useNavigation } from '../../context/Navigation/provider'
import { workspaces } from '../../context/Navigation/types'

const tabs = [
  { displayName: 'Processor', type: workspaces.PROCESSOR },
  { displayName: 'Text Editor', type: workspaces.TEXTEDITOR },
  { displayName: 'Translator', type: workspaces.TRANSLATOR },
  { displayName: 'Details', type: workspaces.DETAILS },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ToolTabs() {
  const { selectedWorkspace, setSelectedWorkspace } = useNavigation()

  const getIsSelectedTab = (type: workspaces) => type === selectedWorkspace

  return (
    <div className="bg-white shadow">
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.displayName}
                onClick={_ => setSelectedWorkspace(tab.type)}
                className={classNames(
                  getIsSelectedTab(tab.type)
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'cursor-pointer w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm'
                )}
                aria-current={getIsSelectedTab(tab.type) ? 'page' : undefined}
              >
                {tab.displayName}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}