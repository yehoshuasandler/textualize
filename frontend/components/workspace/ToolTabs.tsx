import { useState } from 'react'

const tabs = [
  { name: 'Processor', id: 0 },
  { name: 'Text Editor', id: 1 },
  { name: 'Translator', id: 2 },
  { name: 'Details', id: 3 },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ToolTabs() {
  const [selectedTabId, setSelectedTabId] = useState(0)

  const getIsSelectedTab = (tabId: number) => tabId === selectedTabId

  return (
    <div className="bg-white shadow">
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                onClick={_ => setSelectedTabId(tab.id)}
                className={classNames(
                  getIsSelectedTab(tab.id)
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'cursor-pointer w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm'
                )}
                aria-current={getIsSelectedTab(tab.id) ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}