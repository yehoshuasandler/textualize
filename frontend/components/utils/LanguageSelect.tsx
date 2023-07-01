import { Combobox } from '@headlessui/react'
import { LanguageIcon } from '@heroicons/react/20/solid'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import classNames from '../../utils/classNames'
import getSupportedLanguages from '../../utils/getSupportedLanguages'
import { entities } from '../../wailsjs/wailsjs/go/models'

type Props = {
  defaultLanguage?: entities.Language,
  onSelect?: Function
  styles?: Partial<React.CSSProperties>
}

const LanguageSelect = (props?: Props) => {
  const [languages, setLanguages] = useState<entities.Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<entities.Language | undefined>(props?.defaultLanguage)
  const [query, setQuery] = useState('')


  const filteredLanguages = query !== ''
    ? languages.filter(l => l.displayName.toLowerCase().includes(query.toLowerCase()))
    : languages

  useEffect(() => {
    if (languages.length === 0) {
      getSupportedLanguages().then(response => {
        setLanguages(response)
      })
    }
  })

  useEffect(() => {
    setSelectedLanguage(props?.defaultLanguage)
  }, [props?.defaultLanguage])

  const handleLanguageChange = (language: entities.Language) => {
    if (props?.onSelect) props.onSelect(language)
    setSelectedLanguage(language)
  }

  return <Combobox as="div" value={selectedLanguage} onChange={handleLanguageChange} className='block w-full'>
    <div className="block relative">
      <Combobox.Input
        className="w-full border-none bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(language: entities.Language) => language?.displayName}
        placeholder='Document Language'
        style={props?.styles}
      />
      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <LanguageIcon className="text-gray-400" style={props?.styles ? {width: props.styles.fontSize} : {}} />
        <ChevronUpDownIcon className=" text-gray-400" aria-hidden="true" style={props?.styles ? {width: props.styles.fontSize} : {}} />
      </Combobox.Button>

      {filteredLanguages.length > 0 && (
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {filteredLanguages.map((l) => (
            <Combobox.Option
              style={props?.styles}
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
                    <CheckIcon aria-hidden="true" style={props?.styles ? {width: props.styles.fontSize} : {}} />
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
