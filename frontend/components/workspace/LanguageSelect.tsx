import { Combobox } from '@headlessui/react'
import { LanguageIcon } from '@heroicons/react/20/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useProject } from '../../context/Project/provider'
import classNames from '../../utils/classNames'
import getSupportedLanguages from '../../utils/getSupportedLanguages'
import { ipc } from '../../wailsjs/wailsjs/go/models'

type forAreaType = { shouldUpdateArea?: true, shouldUpdateDocument?: never }
type forDocumentType = { shouldUpdateDocument?: true, shouldUpdateArea?: never }
type Props = (forAreaType | forDocumentType) & { defaultLanguage?: ipc.Language }

const LanguageSelect = (props?: Props) => {
  const { requestUpdateDocument, getSelectedDocument } = useProject()
  const [languages, setLanguages] = useState<ipc.Language[]>([])
  const [query, setQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<ipc.Language | undefined>(props?.defaultLanguage)


  const filteredLanguages = query === ''
    ? languages
    : languages.filter(l => {
      return l.displayName.toLowerCase().includes(query.toLowerCase())
    })

  useEffect(() => {
    if (languages.length === 0) {
      getSupportedLanguages().then(response => {
        setLanguages(response)
      })
    }
  })

  useEffect(() => {
    if (props?.shouldUpdateDocument && selectedLanguage?.displayName) {
      const currentDocument = { ...getSelectedDocument() }
      currentDocument.defaultLanguage = selectedLanguage
      requestUpdateDocument(currentDocument)
    }
  }, [selectedLanguage])


  return <Combobox as="div" value={selectedLanguage} onChange={setSelectedLanguage}>
    <div className="inline-block relative">
      <Combobox.Input
        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(language: ipc.Language) => language?.displayName}
        placeholder='Document Language'
      />
      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <LanguageIcon className="h-5 w-5 text-gray-400" />
        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </Combobox.Button>

      {filteredLanguages.length > 0 && (
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredLanguages.map((l) => (
            <Combobox.Option
              key={l.displayName}
              value={l}
              className={({ active }) => classNames(
                'relative cursor-default select-none py-2 pl-3 pr-9',
                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
              )}>
              {({ active, selected }) => <>
                <span className={classNames('block truncate', selected && 'font-semibold')}>{l.displayName}</span>
                {selected && (
                  <span className={classNames(
                    'absolute inset-y-0 right-0 flex items-center pr-4',
                    active ? 'text-white' : 'text-indigo-600'
                  )}>
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </>
              }
            </Combobox.Option>
          ))}
        </Combobox.Options>
      )}
    </div>
  </Combobox>
}

export default LanguageSelect
