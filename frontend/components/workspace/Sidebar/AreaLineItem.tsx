'use client'

import React, { useRef, useState } from 'react'
import { useProject } from '../../../context/Project/provider'
import classNames from '../../../utils/classNames'
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { SidebarArea } from './types'
import { useSidebar } from './provider'
import onEnterHandler from '../../../utils/onEnterHandler'
import processImageArea from '../../../useCases/processImageArea'


const AreaLineItem = (props: { area: SidebarArea, documentId: string, index: number }) => {
  const {
    getAreaById,
    requestUpdateArea,
    setSelectedDocumentId,
    setSelectedAreaId,
    requestChangeAreaOrder,
    requestDeleteAreaById,
  } = useProject()

  const {
    selectedAreaId,
    isEditAreaNameInputShowing,
    setIsEditAreaNameInputShowing,
  } = useSidebar()

  const editAreaNameTextInput = useRef<HTMLInputElement>(null)

  const [dragOverAreaId, setDragOverAreaId] = useState('')

  const onConfirmAreaNameChangeHandler = async (areaDetails: { areaId: string, areaName: string }) => {
    const { areaId, areaName } = areaDetails

    const areaToUpdate = getAreaById(areaId)
    if (areaToUpdate) {
      areaToUpdate.name = areaName
      requestUpdateArea(areaToUpdate)
        .then(response => console.log(response))
        .catch(console.error)
    }
    setIsEditAreaNameInputShowing(false)
  }

  const onAreaClick = (areaId: string) => {
    setSelectedDocumentId(props.documentId)
    setSelectedAreaId(areaId)
  }

  const onAreaDoubleClick = (areaId: string) => {
    setSelectedDocumentId(props.documentId)
    setIsEditAreaNameInputShowing(true)
  }

  const onAreaInputBlur = () => {
    setIsEditAreaNameInputShowing(false)
  }

  const onAreaDragOver = (areaId: string) => {
    setDragOverAreaId(areaId)
  }

  const onAreaDragStart = (areaId: string) => {
    setSelectedAreaId(areaId)
  }

  const onAreaDropEnd = (areaId: string) => {
    const areaDroppedOn = getAreaById(areaId)
    if (!areaDroppedOn) return
    requestChangeAreaOrder(areaId, areaDroppedOn.order)
    setDragOverAreaId('')
  }

  const handleAreaDeleteButtonClick = (areaId: string) => {
    requestDeleteAreaById(areaId)
  }

  const handleReprocessAreaButtonClick = async () => {
    const response = await processImageArea(props.documentId, props.area.id)
    console.log(response)
  }

  return <li>
    {selectedAreaId === props.area.id && isEditAreaNameInputShowing
      ? <input
        type="text"
        name="areaName"
        id="areaName"
        autoFocus
        className="h-8 text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 block w-full rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder={props.area.name || `Area ${props.index}`}
        onBlur={onAreaInputBlur}
        onKeyDown={(event) => {
          onEnterHandler(event,
            () => onConfirmAreaNameChangeHandler({ areaId: props.area.id, areaName: event.currentTarget.value }))
        }}
        ref={editAreaNameTextInput}
      />
      : <div
        draggable
        onDragOver={() => onAreaDragOver(props.area.id)}
        onDragStart={() => onAreaDragStart(props.area.id)}
        onDragEnd={() => onAreaDropEnd(props.area.id)}
        className={classNames('flex justify-between items-center cursor-pointer',
          selectedAreaId === props.area.id ? 'bg-indigo-500 text-gray-200' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
          dragOverAreaId === props.area.id ? 'bg-gray-300 text-gray-700' : '',
          selectedAreaId === props.area.id && dragOverAreaId === props.area.id ? 'bg-indigo-300' : '',
        )}>
        <a
          role='button'
          onClick={() => onAreaClick(props.area.id)}
          onDoubleClick={() => onAreaDoubleClick(props.area.id)}
          className={classNames('group w-full pr-2 py-2 text-left font-medium pl-8 text-xs',
            'rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 py-2 select-none',
          )}>
          {props.area.name || `Area ${props.area.order}`}
        </a>
        <ArrowPathIcon
          className='w-6 h-5 mr-2 text-white hover:bg-white hover:text-gray-700 rounded-full p-0.5'
          aria-hidden="true"
          onClick={handleReprocessAreaButtonClick}
        />
        <XMarkIcon
          className='w-6 h-5 mr-2 text-white hover:bg-red-400 hover:text-gray-100 rounded-full p-0.5'
          onClick={() => handleAreaDeleteButtonClick(props.area.id)} />
      </div>
    }
  </li>
}

export default AreaLineItem
