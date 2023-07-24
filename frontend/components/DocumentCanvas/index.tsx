'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useRef } from 'react'
import ToolingOverlay from './ToolingOverlay'
import { useStage } from './context/provider'

const CanvasStage = dynamic(() => import('./CanvasStage'), { ssr: false })

const DocumentCanvas = () => {
  const { setSize } = useStage()
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

  return <div ref={thisRef} className='relative' style={{ height: 'calc(100vh - 140px)' }}>
    <div className='h-full overflow-hidden rounded-lg border-4 border-dashed border-gray-200'>
      <CanvasStage />
      <ToolingOverlay />
    </div>
  </div >
}

export default DocumentCanvas
