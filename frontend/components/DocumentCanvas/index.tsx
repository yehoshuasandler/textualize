'use client'

import React, { useState } from 'react'
import { useProject, } from '../../context/Project/provider'
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline'
import classNames from '../../utils/classNames'
import LanguageSelect from '../workspace/LanguageSelect'
import ImageCanvas from './ImageCanvas'
import AreaCanvas from './AreaCanvas'
import UiCanvas from './UiCanvas'

const zoomStep = 0.025
const maxZoomLevel = 4

const DocumentCanvas = () => {
  const { getSelectedDocument } = useProject()
  const selectedDocument = getSelectedDocument()

  const [zoomLevel, setZoomLevel] = useState(1)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const { width, height } = size

  return <div className='relative'>
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
    <div className={classNames('relative mt-2 overflow-scroll',
      'w-[calc(100vw-320px)] h-[calc(100vh-174px)] border-4',
      'border-dashed border-gray-200')}>

      <ImageCanvas imagePath={selectedDocument?.path} zoomLevel={zoomLevel} setSize={setSize} />
      <AreaCanvas width={width} height={height} zoomLevel={zoomLevel} />
      <UiCanvas
        width={width}
        height={height}
        setZoomLevel={setZoomLevel}
        zoomDetails={{
          currentZoomLevel: zoomLevel,
          maxZoomLevel: maxZoomLevel,
          zoomStep: zoomStep,
        }} />
    </div>
  </div >
}

export default DocumentCanvas
