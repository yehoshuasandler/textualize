'use client'

import React, { useRef, useState } from 'react'
import { entities } from '../../../wailsjs/wailsjs/go/models'
import { Html } from 'react-konva-utils'
import { ClipboardIcon, ArrowPathIcon, TrashIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { getScaled, makeFormStyles, makeIconStyles } from './styles'
import { useProject } from '../../../context/Project/provider'
import asyncClick from '../../../utils/asyncClick'
import processImageArea from '../../../useCases/processImageArea'
import classNames from '../../../utils/classNames'
import { useNotification } from '../../../context/Notification/provider'
import LanguageSelect from '../../utils/LanguageSelect'

type Props = {
  x: number,
  y: number,
  scale: number,
  area: entities.Area,
  setIsAreaContextMenuOpen: Function
}


const AreaContextMenu = (props: Props) => {
  const { getProcessedAreaById, requestDeleteAreaById, getSelectedDocument, requestUpdateArea } = useProject()
  const { addNotificationToQueue } = useNotification()
  const formRef = useRef<HTMLFormElement>(null)
  const [shouldShowProcessLanguageSelect, setShouldShowProcessLanguageSelect] = useState(false)
  const { area, setIsAreaContextMenuOpen, scale, x, y } = props

  const handleCopyButtonClick = async () => {
    setIsAreaContextMenuOpen(false)

    const processedArea = await getProcessedAreaById(area.id)
    const wordsOfProcessedArea = processedArea?.lines.flatMap(l => l.words.map(w => w.fullText))
    const fullText = wordsOfProcessedArea?.join(' ')
    if (!fullText) {
      addNotificationToQueue({ message: 'No text found to copy.', level: 'warning' })
      return
    }

    try {
      await navigator.clipboard.writeText(fullText)
      addNotificationToQueue({ message: 'Copied area to clipboard' })
    } catch (err) {
      addNotificationToQueue({ message: 'Error copying area', level: 'error' })
    }
  }

  const handleDeleteButtonClick = async () => {
    setIsAreaContextMenuOpen(false)

    try {
      const response = await requestDeleteAreaById(area.id)
      if (!response) addNotificationToQueue({ message: 'Could not delete area', level: 'warning' })
    } catch (err) {
      addNotificationToQueue({ message: 'Error deleting area', level: 'error' })
    }
  }

  const handleReprocessButtonClick = async () => {
    setIsAreaContextMenuOpen(false)

    const documentId = getSelectedDocument()?.id
    if (!documentId) {
      addNotificationToQueue({ message: 'Issue finding selected document', level: 'warning' })
      return
    }

    try {
      addNotificationToQueue({ message: 'Processing test of area' })
      const response = await processImageArea(documentId, area.id)
      if (response) addNotificationToQueue({ message: 'Area successfully processed' })
      else addNotificationToQueue({ message: 'No text result from processing area', level: 'warning' })
    } catch (err) {
      addNotificationToQueue({ message: 'Error processing area', level: 'error' })
    }
  }

  const handleProcessLanguageSelect = async (selectedLanguage: entities.Language) => {
    setIsAreaContextMenuOpen(false)

    let successfullyUpdatedLanguageOnArea = false
    try {
      successfullyUpdatedLanguageOnArea = await requestUpdateArea({...area, ...{language: selectedLanguage}})
    } catch (err) {
      addNotificationToQueue({ message: 'Error updating area language', level: 'error' })
      return
    }


    const selectedDocumentId = getSelectedDocument()?.id
    if (!successfullyUpdatedLanguageOnArea || !selectedDocumentId) {
      addNotificationToQueue({ message: 'Did not successfully update area language', level: 'warning' })
      return
    }

    try {
      await processImageArea(selectedDocumentId, area.id)
      addNotificationToQueue({ message: 'Finished processing area', level: 'info' })
    } catch (err) {
      addNotificationToQueue({ message: 'Error processing area', level: 'error' })
    }
  }

  const handleOnBlur = (e: React.FocusEvent) => {
    console.log(e.relatedTarget)
    e.preventDefault()
    if (e.relatedTarget === null) setIsAreaContextMenuOpen(false)
  }

  const baseMenuItemClassNames = 'flex items-center justify-between w-full px-3 py-1 flex-shrink-0 text-left cursor-pointer focus:outline-none'

  return <Html>
    <div style={makeFormStyles(x, y, scale)} tabIndex={1} onBlur={handleOnBlur}>
      <div className={classNames(
        'z-40 min-w-max py-1 rounded-md shadow-sm outline-none font-light',
        'bg-white border border-gray-200',)}
      >

        <button autoFocus tabIndex={2}
          onClick={(e) => asyncClick(e, handleCopyButtonClick)} className={
            classNames(baseMenuItemClassNames,
              'focus:bg-neutral-100 hover:bg-slate-300',
            )}>
          <span className="mr-2">Copy Area</span>
          <ClipboardIcon className="ml-2" aria-hidden="true" style={{ ...makeIconStyles(scale) }} />
        </button>

        <button tabIndex={3}
          onClick={(e) => asyncClick(e, handleReprocessButtonClick)} className={
            classNames(baseMenuItemClassNames,
              'focus:bg-neutral-100 hover:bg-slate-300',
            )}>
          <span className="mr-2">Reprocess Area</span>
          <ArrowPathIcon className="ml-2" aria-hidden="true" style={{ ...makeIconStyles(scale) }} />
        </button>

        <button tabIndex={4}
          onClick={(e) => asyncClick(e, handleDeleteButtonClick)} className={
            classNames(baseMenuItemClassNames,
              'focus:bg-neutral-100 bg-red-100 text-gray-900 hover:text-gray-100 hover:bg-red-600',
            )}>
          <span className="mr-2">Delete Area</span>
          <TrashIcon className="ml-2" aria-hidden="true" style={{ ...makeIconStyles(scale) }} />
        </button>

        {shouldShowProcessLanguageSelect
          ? <LanguageSelect
          defaultLanguage={area.language || getSelectedDocument()?.defaultLanguage}
          styles={{ fontSize: `${getScaled(14, scale)}px` }}
          onSelect={handleProcessLanguageSelect}
          />
          : <button tabIndex={5}
            onClick={(e) => setShouldShowProcessLanguageSelect(true)}
            className={classNames(
              baseMenuItemClassNames,
              'focus:bg-neutral-100 hover:bg-slate-300',
            )}>
            <span className="mr-2">
              {area.language?.displayName || getSelectedDocument()?.defaultLanguage.displayName}
              </span>
            <LanguageIcon className="ml-2" aria-hidden="true" style={{ ...makeIconStyles(scale) }} />
          </button>
        }
      </div>
    </div>
  </Html >

}

export default AreaContextMenu
