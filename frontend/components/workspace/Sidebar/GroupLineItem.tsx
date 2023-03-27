'use client'

import { DocumentPlusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useRef, useState } from 'react'
import { useProject } from '../../../context/Project/provider'
import classNames from '../../../utils/classNames'
import onEnterHandler from '../../../utils/onEnterHandler'
import AddGroupInput from './AddGroupInput'
import DocumentLineItem from './DocumentLineItem'
import { useSidebar } from './provider'
import { SidebarGroup } from './types'



const GroupLineItem = (props: { group: SidebarGroup }) => {
  const {
    requestAddDocument,
    requestChangeGroupOrder,
    getGroupById,
  } = useProject()

  const {
    selectedGroupId,
    isAddNewDocumentInputShowing,
    setSelectedDocumentId,
    setSelectedGroupId,
    setIsAddNewDocumentInputShowing,
    setIsAddNewGroupInputShowing,
  } = useSidebar()

  const addDocumentTextInput = useRef<HTMLInputElement>(null)

  const [dragOverGroupId, setDragOverGroupId] = useState('')

  const onConfirmAddDocumentClickHandler = async (groupId: string) => {
    const documentName = addDocumentTextInput.current?.value
    if (!documentName) return

    const response = await requestAddDocument(groupId, documentName)
    if (!response.id) return

    setSelectedDocumentId(response.id)
    setSelectedGroupId(groupId)
    setIsAddNewDocumentInputShowing(false)
  }

  const onCancelAddItemClickHandler = () => {
    setIsAddNewDocumentInputShowing(false)
  }

  const onAddNewDocumentLineItemClickHandler = (groupId: string) => {
    setSelectedGroupId(groupId)
    setIsAddNewDocumentInputShowing(true)
    setIsAddNewGroupInputShowing(false)
  }

  const onGroupDragOver = (groupId: string) => {
    setDragOverGroupId(groupId)
  }

  const onGroupDragStart = (groupId: string) => {
    setSelectedGroupId(groupId)
  }

  const onGroupDropEnd = (groupId: string) => {
    const areaDroppedOn = getGroupById(groupId)
    console.log('areaDroppedOn', areaDroppedOn)
    if (!areaDroppedOn) return
    const response = requestChangeGroupOrder(groupId, areaDroppedOn.order)
    setDragOverGroupId('')
  }

  const renderAddNewDocument = (groupId: string) => {
    return isAddNewDocumentInputShowing && selectedGroupId === groupId
      ? <div className="flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10 text-lg">
          <input
            type="text"
            name="documentName"
            id="documentName"
            className="h-8 text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 block w-full rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Add Document"
            autoFocus
            onKeyDown={(event) => {
              onEnterHandler(event,
                () => onConfirmAddDocumentClickHandler(groupId))
            }}
            ref={addDocumentTextInput}
          />
        </div>
        <button
          type="button"
          onClick={onCancelAddItemClickHandler}
          className="bg-gray-900 bg-opacity-5 relative -ml-px inline-flex items-center space-x-2 border border-gray-400  px-1 py-0 text-sm font-medium text-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <XMarkIcon className="h-4 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onConfirmAddDocumentClickHandler(groupId)}
          className="bg-gray-900 bg-opacity-5 relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-400  px-1 py-0 text-sm font-medium text-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <PlusIcon className="h-7 w-5" aria-hidden="true" />
        </button>
      </div>
      :
      <a
        role='button'
        className={classNames(
          'text-gray-300 hover:bg-gray-700 hover:text-white',
          ' group w-full flex items-center pl-5 py-2 text-left font-medium',
          'text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
        )}
        onClick={() => onAddNewDocumentLineItemClickHandler(groupId)}
      >
        <DocumentPlusIcon className="h-3.5 mr-1" aria-hidden="true" />
        Add Document
      </a>
  }

  return (<details key={props.group.name} open={props.group.id === selectedGroupId}>
    <summary
      draggable
      onDragOver={() => onGroupDragOver(props.group.id)}
      onDragEnd={() => onGroupDropEnd(props.group.id)}
      className={classNames(
        'group items-center px-2 py-2 text-base font-medium rounded-t-md',
        selectedGroupId === props.group.id ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        (dragOverGroupId === props.group.id) && props.group.id ? 'bg-gray-300 text-gray-700' : '',
      )}
    >
      <a role='button'>{props.group.name}</a>
    </summary>
    <ul>
      {props.group.documents.map((d, index) => (
        <DocumentLineItem key={d.id} document={d} index={index} groupId={props.group.id} />
        // <li className='p-0 m-0' key={d.id}>
        //   {!d.areas.length
        //     ?
        //     <div
        //       onClick={() => onDocumentClickHandler(d.id)}
        //       onDoubleClick={() => onDocumentDoubleClickHandler(d.id)}
        //       className={classNames(
        //         d.id === selectedDocumentId
        //           ? 'bg-gray-900 text-white'
        //           : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        //         'group items-center py-2 text-base font-medium rounded-b-md pl-10',
        //         index !== 0 ? 'rounded-t-md' : '',
        //       )}>
        //       {selectedDocumentId === d.id && isEditDocumentNameInputShowing
        //         ? <input
        //           type="text"
        //           name="documentName"
        //           id="documentName"
        //           autoFocus
        //           className="h-8 w-[calc(100%-18px)] text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 inline-block rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //           defaultValue={d.name}
        //           onBlur={onDocumentInputBlur}
        //           onKeyDown={(event) => {
        //             onEnterHandler(event,
        //               () => onConfirmDocumentNameChangeHandler(event.currentTarget.value))
        //           }}
        //           ref={editDocumentNameTextInput}
        //         />
        //         : <a
        //           role='button'
        //           className={classNames(
        //             d.id === selectedDocumentId
        //               ? 'bg-gray-900 text-white'
        //               : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        //             'text-left font-medium text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 '
        //           )}
        //         >
        //           {d.name}
        //         </a>
        //       }
        //     </div>
        //     : <details>
        //       <summary
        //         onClick={() => onDocumentClickHandler(d.id)}
        //         onDoubleClick={() => onDocumentDoubleClickHandler(d.id)}
        //         className={classNames(
        //           d.id === selectedDocumentId
        //             ? 'bg-gray-900 text-white'
        //             : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        //           'group items-center py-2 text-base font-medium rounded-b-md pl-6',
        //           index !== 0 ? 'rounded-t-md' : '',

        //         )}>
        //         {selectedDocumentId === d.id && isEditDocumentNameInputShowing
        //           ? <input
        //             type="text"
        //             name="documentName"
        //             id="documentName"
        //             autoFocus
        //             className="h-8 w-[calc(100%-18px)] text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 inline-block rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //             defaultValue={d.name}
        //             onBlur={onDocumentInputBlur}
        //             onKeyDown={(event) => {
        //               onEnterHandler(event,
        //                 () => onConfirmDocumentNameChangeHandler(event.currentTarget.value))
        //             }}
        //             ref={editDocumentNameTextInput}
        //           />
        //           : <a
        //             role='button'
        //             className={classNames(
        //               d.id === selectedDocumentId
        //                 ? 'bg-gray-900 text-white'
        //                 : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        //               'text-left font-medium text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 '
        //             )}
        //           >
        //             {d.name}
        //           </a>
        //         }
        //       </summary>
        //       <ul>
        //         {d.areas.map((a, index) => (
        //           <li key={a.id}>
        //             {selectedAreaId === a.id && isEditAreaNameInputShowing
        //               ? <input
        //                 type="text"
        //                 name="areaName"
        //                 id="areaName"
        //                 autoFocus
        //                 className="h-8 text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 block w-full rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                 placeholder={a.name || `Area ${index}`}
        //                 onBlur={onAreaInputBlur}
        //                 onKeyDown={(event) => {
        //                   onEnterHandler(event,
        //                     () => onConfirmAreaNameChangeHandler({ areaId: a.id, areaName: event.currentTarget.value }))
        //                 }}
        //                 ref={editAreaNameTextInput}
        //               />
        //               : <div
        //                 draggable
        //                 onDragOver={() => onAreaDragOver(a.id)}
        //                 onDragStart={() => onAreaDragStart(a.id)}
        //                 onDragEnd={() => onAreaDropEnd(a.id)}
        //                 className={classNames('flex justify-between items-center cursor-pointer',
        //                   selectedAreaId === a.id ? 'bg-indigo-500 text-gray-200' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        //                   dragOverAreaId === a.id ? 'bg-gray-300 text-gray-700' : '',
        //                   selectedAreaId === a.id && dragOverAreaId === a.id ? 'bg-indigo-300' : '',
        //                 )}>
        //                 <a
        //                   role='button'
        //                   onClick={() => onAreaClick(a.id)}
        //                   onDoubleClick={() => onAreaDoubleClick(a.id)}
        //                   className={classNames('group w-full pr-2 py-2 text-left font-medium pl-8 text-xs',
        //                     'rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 py-2 select-none',
        //                   )}>
        //                   {a.name || `Area ${a.order}`}
        //                 </a>
        //                 <ArrowPathIcon
        //                   className='w-6 h-5 mr-2 text-white hover:bg-white hover:text-gray-700 rounded-full p-0.5'
        //                   aria-hidden="true"
        //                   onClick={() => console.log('refresh')}
        //                 />
        //                 <XMarkIcon
        //                   className='w-6 h-5 mr-2 text-white hover:bg-red-400 hover:text-gray-100 rounded-full p-0.5'
        //                   onClick={() => handleAreaDeleteButtonClick(a.id)} />
        //               </div>
        //             }
        //           </li>
        //         ))}
        //       </ul>
        //     </details>
        //   }
        // </li>
      ))}

      {renderAddNewDocument(props.group.id)}
    </ul>
  </details>
  )
}

export default GroupLineItem
