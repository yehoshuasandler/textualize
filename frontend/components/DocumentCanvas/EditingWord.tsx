import React from 'react'
import { Html } from 'react-konva-utils'
import { entities } from '../../wailsjs/wailsjs/go/models'
import { useProject } from '../../context/Project/provider'
import onEnterHandler from '../../utils/onEnterHandler'

type Props = {
  scale: number,
  editingWord: entities.ProcessedWord,
  setEditingWord: Function,
}

const EditingWord = (props: Props) => {
  const { requestUpdateProcessedWordById } = useProject()
  const { scale, setEditingWord, editingWord } = props

  const handleWordCorrectionSubmit = (wordId: string, newWordValue: string) => {
    requestUpdateProcessedWordById(wordId, newWordValue).catch(console.error)
    setEditingWord(null)
  }

  const { x0, x1, y0, y1 } = editingWord.boundingBox
  const left = x0 * scale
  const top = y1 * scale
  const width = (x1 - x0) * scale
  const height = (y1 - y0) * scale

  return <Html>
    <input
      defaultValue={editingWord.fullText}
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        textAlign: 'center',
        display: 'block',
        width: `${width}px`,
        height: `${height}px`,
        fontSize: `${Math.floor(48 * scale)}px`,
        alignContent: 'center',
        alignItems: 'center',
        lineHeight: 0,
        direction: 'RIGHT_TO_LEFT' ? 'rtl' : 'ltr'
      }}
      onKeyDown={(e) => onEnterHandler(e, () => handleWordCorrectionSubmit(editingWord.id, e.currentTarget.value))}
      onBlur={(e) => handleWordCorrectionSubmit(editingWord.id, e.currentTarget.value)}
    />
  </Html>
}

export default EditingWord