import { useNavigation } from '../../context/Navigation/provider'
import { workspaces } from '../../context/Navigation/types'
import classNames from '../../utils/classNames'

const tabs = [
  { displayName: 'Processor', type: workspaces.PROCESSOR },
  { displayName: 'Text Editor', type: workspaces.TEXTEDITOR },
  { displayName: 'Translator', type: workspaces.TRANSLATOR, disabled: true, },
  { displayName: 'Details', type: workspaces.DETAILS, disabled: true, },
]

const getTabClasses = (isTabSelected: boolean, isDisabled?: boolean) => {
  if (isDisabled) return classNames('cursor-not-allowed w-1/4 py-4 px-1 text-center border-b-2 font-medium text-gray-200 text-sm')

  const baseClasses = 'cursor-pointer w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm'
  if (isTabSelected) return classNames(baseClasses, 'border-indigo-500 text-indigo-600')
  else return classNames(baseClasses, 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
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
                aria-disabled={tab.disabled}
                key={tab.displayName}
                onClick={_ =>  {
                  if (!tab.disabled) setSelectedWorkspace(tab.type)
                }}
                className={getTabClasses(getIsSelectedTab(tab.type), tab.disabled)}
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