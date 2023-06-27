'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import { useProject, } from '../../context/Project/provider'
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline'
import LanguageSelect from '../workspace/LanguageSelect'

const CanvasStage = dynamic(() => import('./CanvasStage'), {
  ssr: false,
})

const zoomStep = 0.01
const maxZoomLevel = 4

const DocumentCanvas = () => {
  const { getSelectedDocument } = useProject()
  const selectedDocument = getSelectedDocument()

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

  return <div ref={thisRef} className='relative' style={{ height: 'calc(100vh - 200px)' }}>
    <div className='flex justify-between align-top mb-2'>
      <div className='flex align-top'>
        <h1 className="text-xl font-semibold text-gray-900 inline-block mr-2">{selectedDocument?.name}</h1>
        <LanguageSelect shouldUpdateDocument defaultLanguage={selectedDocument?.defaultLanguage} />
      </div>
      <div className='flex justify-evenly items-center'>
        <MagnifyingGlassMinusIcon className='w-4 h-4' />
        <input
          id="zoomRange" type="range" min={zoomStep} max={maxZoomLevel} step={zoomStep}
          value={zoomLevel} className="w-[calc(100%-50px)] h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer p-0"
          onChange={(e) => { setZoomLevel(e.currentTarget.valueAsNumber) }}
        />
        <MagnifyingGlassPlusIcon className='w-4 h-4' />
      </div>
    </div>

    <div className='h-full overflow-hidden rounded-lg border-4 border-dashed border-gray-200'>
      <CanvasStage size={size} scale={zoomLevel} scaleStep={zoomStep} setScale={setZoomLevel} maxScale={maxZoomLevel} />
    </div>
  </div >
}

export default DocumentCanvas
