import React, { useRef } from 'react'
import { ipc } from '../../wailsjs/wailsjs/go/models'
import classNames from '../../utils/classNames'
import onEnterHandler from '../../utils/onEnterHandler'
import { useProject } from '../../context/Project/provider'

type Props = {
  zoomLevel: number
  processedArea?: ipc.ProcessedArea
  wordToEdit?: ipc.ProcessedWord
  setWordToEdit: (props?: { word: ipc.ProcessedWord, areaId: string }) => void
  setHoveredProcessedArea: (area?: ipc.ProcessedArea) => void
}

const EditProcessedWord = ({ setWordToEdit, zoomLevel, wordToEdit, processedArea, setHoveredProcessedArea }: Props) => {
  const {
    requestUpdateProcessedWordById,
    getProcessedAreaById,
  } = useProject()
  const editWordInput = useRef<HTMLInputElement>(null)


  if (!wordToEdit || !processedArea) return <></>

  const width = Math.floor((wordToEdit.boundingBox.x1 - wordToEdit.boundingBox.x0) * zoomLevel) + 2
  const height = Math.floor(((wordToEdit.boundingBox.y1 - wordToEdit.boundingBox.y0) * zoomLevel) * 2) + 4

  const handleWordCorrectionSubmit = (wordId: string, newWordValue: string) => {
    requestUpdateProcessedWordById(wordId, newWordValue)
      .then(res => {
        getProcessedAreaById(processedArea.id || '').then(response => {
          setHoveredProcessedArea(response)
        })
      })
      .catch(console.error)
    setWordToEdit(undefined)
  }

  return <div
    dir={wordToEdit.direction === 'RIGHT_TO_LEFT' ? 'rtl' : 'ltr'}
    className={classNames('absolute inline-block p-1 rounded-md',
      'bg-opacity-60 bg-black text-white',
    )}
    style={{
      width,
      height,
      top: Math.floor(wordToEdit.boundingBox.y0 * zoomLevel) + (height / 2),
      left: Math.floor(wordToEdit.boundingBox.x0 * zoomLevel)
    }}
    onBlur={() => setWordToEdit(undefined)}
  >
    <div
      className={classNames('text-center align-middle block p-1 rounded-md shadow-zinc-900 shadow-2xl',
        'bg-opacity-60 bg-black text-white',
      )}
      style={{
        fontSize: `${3.4 * zoomLevel}vmin`,
        height: height / 2,
      }}>
      {wordToEdit.fullText}
    </div>

    <input
      type='text'
      className='inline-block text-slate-900 p-0 m-0 w-full'
      autoFocus
      width={width}
      ref={editWordInput}
      placeholder={wordToEdit.fullText}
      defaultValue={wordToEdit.fullText}
      style={{
        fontSize: `${3.4 * zoomLevel}vmin`,
        height: height / 2,
      }}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={(e) => handleWordCorrectionSubmit(wordToEdit.id, e.currentTarget.value)}
      onKeyDown={(e) => onEnterHandler(e, () => handleWordCorrectionSubmit(wordToEdit.id, e.currentTarget.value))}
    />
  </div>
}

export default EditProcessedWord