import React from 'react'
import { entities } from '../../wailsjs/wailsjs/go/models'
import classNames from '../../utils/classNames'

type Props = {
  areas: entities.Area[]
  processedArea?: entities.ProcessedArea
  zoomLevel: number
  setWordToEdit: (props: { word: entities.ProcessedWord, areaId: string }) => void
}

const AreaTextPreview = ({ areas, processedArea, zoomLevel, setWordToEdit }: Props) => {
  if (!processedArea) return <></>


  return <div>
    {
      processedArea.lines?.map(l => l.words).flat().map((w, i) => {
        const width = Math.floor((w.boundingBox.x1 - w.boundingBox.x0) * zoomLevel) + 2
        const height = Math.floor((w.boundingBox.y1 - w.boundingBox.y0) * zoomLevel) + 2
        return <span
          key={i}
          dir={w.direction === 'RIGHT_TO_LEFT' ? 'rtl' : 'ltr'}
          className={classNames('absolute text-center inline-block p-1 rounded-md shadow-zinc-900 shadow-2xl',
            'hover:bg-opacity-60 hover:bg-black hover:text-white',
            'bg-opacity-80 bg-slate-300 text-slate-500'
          )}
          style={{
            fontSize: `${3.4 * zoomLevel}vmin`,
            width,
            top: Math.floor(w.boundingBox.y0 * zoomLevel) + height,
            left: Math.floor(w.boundingBox.x0 * zoomLevel)
          }}
          onDoubleClick={() => setWordToEdit({ word: w, areaId: processedArea.id })}>
          {w.fullText}
        </span>
      })
    }
  </div>
}

export default AreaTextPreview
