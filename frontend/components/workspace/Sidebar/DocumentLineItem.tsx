'use client'

import React, { useRef } from 'react'
import { useProject } from '../../../context/Project/provider'
import classNames from '../../../utils/classNames'
import onEnterHandler from '../../../utils/onEnterHandler'
import AreaLineItem from './AreaLineItem'
import { useSidebar } from './provider'
import { SidebarDocument } from './types'

const DocumentLineItem = (props: { document: SidebarDocument, groupId: string, index: number }) => {
  const {
    getSelectedDocument,
    requestUpdateDocument
  } = useProject()

  const {
    selectedDocumentId,
    setSelectedDocumentId,
    isEditDocumentNameInputShowing,
    setIsAddNewDocumentInputShowing,
    setSelectedGroupId,
    setIsAddNewGroupInputShowing,
    setIsEditDocumentNameInputShowing,
  } = useSidebar()

  const editDocumentNameTextInput = useRef<HTMLInputElement>(null)

  const onDocumentClickHandler = (itemId: string) => {
    setSelectedDocumentId(itemId)
    setSelectedGroupId(props.groupId)
    setIsAddNewDocumentInputShowing(false)
    setIsAddNewGroupInputShowing(false)
  }

  const onDocumentDoubleClickHandler = (docuemntId: string) => {
    setIsEditDocumentNameInputShowing(true)
  }

  const onDocumentInputBlur = () => {
    setIsEditDocumentNameInputShowing(false)
  }

  const onConfirmDocumentNameChangeHandler = async (documentName: string) => {
    const documentToUpdate = { ...getSelectedDocument() }
    if (documentToUpdate) {
      documentToUpdate.name = documentName
      requestUpdateDocument(documentToUpdate)
        .then(response => console.log('onConfirmDocumentNameChangeHandler response: ', response))
        .catch(console.error)
    }
    setIsEditDocumentNameInputShowing(false)
  }

  return (
    <li className='p-0 m-0' key={props.document.id}>
    {!props.document.areas.length
      ?
      <div
        onClick={() => onDocumentClickHandler(props.document.id)}
        onDoubleClick={() => onDocumentDoubleClickHandler(props.document.id)}
        className={classNames(
          props.document.id === selectedDocumentId
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
          'group items-center py-2 text-base font-medium rounded-b-md pl-10',
          props.index !== 0 ? 'rounded-t-md' : '',
        )}>
        {selectedDocumentId === props.document.id && isEditDocumentNameInputShowing
          ? <input
            type="text"
            name="documentName"
            id="documentName"
            autoFocus
            className="h-8 w-[calc(100%-18px)] text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 inline-block rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            defaultValue={props.document.name}
            onBlur={onDocumentInputBlur}
            onKeyDown={(event) => {
              onEnterHandler(event,
                () => onConfirmDocumentNameChangeHandler(event.currentTarget.value))
            }}
            ref={editDocumentNameTextInput}
          />
          : <a
            role='button'
            className={classNames(
              props.document.id === selectedDocumentId
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'text-left font-medium text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 '
            )}
          >
            {props.document.name}
          </a>
        }
      </div>
      : <details>
        <summary
          onClick={() => onDocumentClickHandler(props.document.id)}
          onDoubleClick={() => onDocumentDoubleClickHandler(props.document.id)}
          className={classNames(
            props.document.id === selectedDocumentId
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'group items-center py-2 text-base font-medium rounded-b-md pl-6',
            props.index !== 0 ? 'rounded-t-md' : '',

          )}>
          {selectedDocumentId === props.document.id && isEditDocumentNameInputShowing
            ? <input
              type="text"
              name="documentName"
              id="documentName"
              autoFocus
              className="h-8 w-[calc(100%-18px)] text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 inline-block rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              defaultValue={props.document.name}
              onBlur={onDocumentInputBlur}
              onKeyDown={(event) => {
                onEnterHandler(event,
                  () => onConfirmDocumentNameChangeHandler(event.currentTarget.value))
              }}
              ref={editDocumentNameTextInput}
            />
            : <a
              role='button'
              className={classNames(
                props.document.id === selectedDocumentId
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'text-left font-medium text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 '
              )}
            >
              {props.document.name}
            </a>
          }
        </summary>
        <ul>
          {props.document.areas.map((a, index) => (
            <AreaLineItem key={a.id} area={a} index={index} documentId={props.document.id} />
            // <li key={a.id}>
            //   {selectedAreaId === a.id && isEditAreaNameInputShowing
            //     ? <input
            //       type="text"
            //       name="areaName"
            //       id="areaName"
            //       autoFocus
            //       className="h-8 text-white placeholder-gray-400 bg-gray-900 bg-opacity-5 block w-full rounded-none rounded-l-md border-late-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            //       placeholder={a.name || `Area ${index}`}
            //       onBlur={onAreaInputBlur}
            //       onKeyDown={(event) => {
            //         onEnterHandler(event,
            //           () => onConfirmAreaNameChangeHandler({ areaId: a.id, areaName: event.currentTarget.value }))
            //       }}
            //       ref={editAreaNameTextInput}
            //     />
            //     : <div
            //       draggable
            //       onDragOver={() => onAreaDragOver(a.id)}
            //       onDragStart={() => onAreaDragStart(a.id)}
            //       onDragEnd={() => onAreaDropEnd(a.id)}
            //       className={classNames('flex justify-between items-center cursor-pointer',
            //         selectedAreaId === a.id ? 'bg-indigo-500 text-gray-200' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            //         dragOverAreaId === a.id ? 'bg-gray-300 text-gray-700' : '',
            //         selectedAreaId === a.id && dragOverAreaId === a.id ? 'bg-indigo-300' : '',
            //       )}>
            //       <a
            //         role='button'
            //         onClick={() => onAreaClick(a.id)}
            //         onDoubleClick={() => onAreaDoubleClick(a.id)}
            //         className={classNames('group w-full pr-2 py-2 text-left font-medium pl-8 text-xs',
            //           'rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 py-2 select-none',
            //         )}>
            //         {a.name || `Area ${a.order}`}
            //       </a>
            //       <ArrowPathIcon
            //         className='w-6 h-5 mr-2 text-white hover:bg-white hover:text-gray-700 rounded-full p-0.5'
            //         aria-hidden="true"
            //         onClick={() => console.log('refresh')}
            //       />
            //       <XMarkIcon
            //         className='w-6 h-5 mr-2 text-white hover:bg-red-400 hover:text-gray-100 rounded-full p-0.5'
            //         onClick={() => handleAreaDeleteButtonClick(a.id)} />
            //     </div>
            //   }
            // </li>
          ))}
        </ul>
      </details>
    }
  </li>
  )
}

export default DocumentLineItem
