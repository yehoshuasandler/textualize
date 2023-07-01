'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import { useProject, } from '../../context/Project/provider'
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline'
import LanguageSelect from '../utils/LanguageSelect'
import { entities } from '../../wailsjs/wailsjs/go/models'

const CanvasStage = dynamic(() => import('./CanvasStage'), {
  ssr: false,
})

const zoomStep = 0.01
const maxZoomLevel = 4

const DocumentCanvas = () => {
  const { getSelectedDocument, selectedAreaId, } = useProject()
  const selectedDocument = getSelectedDocument()
  const [ selectedArea, setSelectedArea ] = useState<entities.Area | undefined>()

  const [zoomLevel, setZoomLevel] = useState(1)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const thisRef = useRef<HTMLDivElement>(null)


  const handleWindowResize = () => {
    const width = thisRef?.current?.clientWidth || 0
    const height = thisRef?.current?.clientHeight || 0
    setSize({ width, height })
  }

  useEffect(() => {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [thisRef?.current?.clientWidth, thisRef?.current?.clientHeight])

  useEffect(() => {
    setSelectedArea(selectedDocument?.areas.find(a => a.id == selectedAreaId))
  }, [selectedAreaId])

  return <div ref={thisRef} className='relative' style={{ height: 'calc(100vh - 140px)' }}>
    <div className='h-full overflow-hidden rounded-lg border-4 border-dashed border-gray-200'>
      <CanvasStage size={size} scale={zoomLevel} scaleStep={zoomStep} setScale={setZoomLevel} maxScale={maxZoomLevel} />
      <div className='absolute flex justify-between align-top top-2 p-2 drop-shadow-2xl pointer-events-none shadow-slate-100' style={{ width: 'calc(100% - 0.5rem)' }}>
        <div className='align-top pointer-events-auto w-1/3'>
          <h1 className="text-lg font-medium text-gray-900 block mr-2 drop-shadow-2xl shadow-slate-100 drop truncate">
            {selectedArea?.name
              ? `${selectedDocument?.name} / ${selectedArea?.name}`
              : selectedDocument?.name
            }
          </h1>
          <LanguageSelect styles={{fontSize: '16px', borderRadius: '2px'}} defaultLanguage={selectedArea?.language || selectedDocument?.defaultLanguage} />
        </div>
        <div className='flex mt-4 justify-evenly align-top pointer-events-auto'>
          <MagnifyingGlassMinusIcon className='w-4 h-4' />
          <input
            id="zoomRange" type="range" min={zoomStep} max={maxZoomLevel} step={zoomStep}
            value={zoomLevel} className="w-[calc(100%-50px)] h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer p-0"
            onChange={(e) => { setZoomLevel(e.currentTarget.valueAsNumber) }}
          />
          <MagnifyingGlassPlusIcon className='w-4 h-4' />
        </div>
      </div>
    </div>
  </div >
}

export default DocumentCanvas
