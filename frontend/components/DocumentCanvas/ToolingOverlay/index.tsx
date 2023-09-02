'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { DocumentTextIcon, LanguageIcon, LinkIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, SquaresPlusIcon } from '@heroicons/react/24/outline'
import { useProject } from '../../../context/Project/provider'
import { entities } from '../../../wailsjs/wailsjs/go/models'
import LanguageSelect from '../../utils/LanguageSelect'
import { useStage } from '../context/provider'
import ToolToggleButton from './ToolToggleButton'
import processImageArea from '../../../useCases/processImageArea'
import { pushNotification } from '../../../redux/features/notifications/notificationQueueSlice'


const ToolingOverlay = () => {
  const dispatch = useDispatch()
  const { getSelectedDocument, selectedAreaId, requestUpdateArea, requestUpdateDocument, updateDocuments } = useProject()
  const {
    scale, scaleStep, maxScale, setScale,
    isLinkAreaContextsVisible, setIsLinkAreaContextsVisible,
    isAreasVisible, setIsAreasVisible,
    isProcessedWordsVisible, setIsProcessedWordsVisible,
    isTranslatedWordsVisible, setIsTranslatedWordsVisible,
  } = useStage()

  const selectedDocument = getSelectedDocument()
  const [selectedArea, setSelectedArea] = useState<entities.Area | undefined>()

  useEffect(() => {
    setSelectedArea(selectedDocument?.areas.find(a => a.id == selectedAreaId))
  }, [selectedAreaId, selectedDocument, selectedArea])

  const handleAreaProcessLanguageSelect = async (selectedLanguage: entities.Language) => {
    if (!selectedArea) return

    let successfullyUpdatedLanguageOnArea = false
    try {
      successfullyUpdatedLanguageOnArea = await requestUpdateArea({ ...selectedArea, ...{ language: selectedLanguage } })
    } catch (err) {
      dispatch(pushNotification({ message: 'Error updating area language', level: 'error' }))
      return
    }

    const selectedDocumentId = getSelectedDocument()?.id
    if (!successfullyUpdatedLanguageOnArea || !selectedDocumentId) {
      dispatch(pushNotification({ message: 'Did not successfully update area language', level: 'warning' }))
      return
    }

    try {
      await processImageArea(selectedDocumentId, selectedArea.id)
      await updateDocuments()
      dispatch(pushNotification({ message: 'Finished processing area', level: 'info' }))
    } catch (err) {
      dispatch(pushNotification({ message: 'Error processing area', level: 'error' }))
    }
  }

  const handleDocumentProcessLanguageSelect = async (selectedLanguage: entities.Language) => {
    if (!selectedDocument) return

    const currentDocument = selectedDocument
    currentDocument.defaultLanguage = selectedLanguage
    await requestUpdateDocument(currentDocument)
    await updateDocuments()
  }


  const renderLanguageSelect = () => {
    const defaultLanguage = selectedArea?.language.displayName ? selectedArea?.language : selectedDocument?.defaultLanguage
    const onSelect = selectedArea ? handleAreaProcessLanguageSelect : handleDocumentProcessLanguageSelect

    return <LanguageSelect
      styles={{ fontSize: '16px', borderRadius: '2px' }}
      defaultLanguage={defaultLanguage}
      onSelect={onSelect}
    />
  }

  return <>
    {/* Top buttons */}
    <div className='absolute flex justify-between align-top top-2 p-2 drop-shadow-2xl pointer-events-none shadow-slate-100' style={{ width: 'calc(100% - 0.5rem)' }}>
      <div className='align-top pointer-events-auto w-1/3'>
        <h1 className="text-lg font-medium text-gray-900 block mr-2 drop-shadow-2xl shadow-slate-100 drop truncate">
          {selectedArea?.name
            ? `${selectedDocument?.name} / ${selectedArea?.name}`
            : selectedDocument?.name
          }
        </h1>
        { renderLanguageSelect() }
        {/* <LanguageSelect styles={{ fontSize: '16px', borderRadius: '2px' }} defaultLanguage={selectedArea?.language.displayName ? selectedArea?.language : selectedDocument?.defaultLanguage} /> */}
      </div>
      <div className='flex mt-4 justify-evenly align-top pointer-events-auto'>
        <MagnifyingGlassMinusIcon className='w-4 h-4' />
        <input
          id="zoomRange" type="range" min={scaleStep} max={maxScale} step={scaleStep}
          value={scale} className="w-[calc(100%-50px)] h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer p-0"
          onChange={(e) => { setScale(e.currentTarget.valueAsNumber) }}
        />
        <MagnifyingGlassPlusIcon className='w-4 h-4' />
      </div>
    </div>

    {/* Right Buttons */}
    <div className='absolute bottom-6 right-3 pointer-events-none'>
      {isAreasVisible
        ? <>
          <ToolToggleButton icon={LinkIcon} hint='Link Area Contexts' isActive={isLinkAreaContextsVisible} onClick={() => setIsLinkAreaContextsVisible(!isLinkAreaContextsVisible)} />
          <ToolToggleButton icon={LanguageIcon} hint='Toggle Translations' isActive={isTranslatedWordsVisible} onClick={() => setIsTranslatedWordsVisible(!isTranslatedWordsVisible)} />
          <ToolToggleButton icon={DocumentTextIcon} hint='Toggle Processed' isActive={isProcessedWordsVisible} onClick={() => setIsProcessedWordsVisible(!isProcessedWordsVisible)} />
        </>
        : <></>
      }

      <ToolToggleButton icon={SquaresPlusIcon} hint='Toggle Areas' isActive={isAreasVisible} onClick={() => setIsAreasVisible(!isAreasVisible)} />
    </div>
  </>
}

export default ToolingOverlay
