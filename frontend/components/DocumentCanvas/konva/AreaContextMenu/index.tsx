'use client'

import React from 'react'
import { entities } from '../../../../wailsjs/wailsjs/go/models'
import { Html } from 'react-konva-utils'
import { copyButtonColors, deleteButtonColors, makeFormStyles, makeSharedButtonStyles, reprocessButtonColors, setMutableStylesOnElement, setPosition, setScale } from './styles'
import { useProject } from '../../../../context/Project/provider'
import asyncClick from '../../../../utils/asyncClick'
import processImageArea from '../../../../useCases/processImageArea'

type Props = {
  x: number,
  y: number,
  scale: number,
  area: entities.Area,
  setIsAreaContextMenuOpen: Function
}

/**
 * This uses Knova's HTML portal which does not support CSS classes.
 * Because of this limitation we have to hack some UX with inline styles.
 * @param {Props} props 
 */
const AreaContextMenu = (props: Props) => {
  const { getProcessedAreaById, requestDeleteAreaById, getSelectedDocument } = useProject()
  const { area, setIsAreaContextMenuOpen, scale, x, y } = props
  setPosition(x, y)
  setScale(scale)
  const sharedButtonStyles = makeSharedButtonStyles()

  const handleBlur = (e: React.FocusEvent) => {
    console.log(e.relatedTarget)
    if (!e.currentTarget.contains(e.relatedTarget)) setIsAreaContextMenuOpen(false)
  }

  const handleCopyButtonClick = async () => {
    const processedArea = await getProcessedAreaById(area.id)
    const wordsOfProcessedArea = processedArea?.lines.flatMap(l => l.words.map(w => w.fullText))
    const fullText = wordsOfProcessedArea?.join(' ')
    if (!fullText) return // TODO: change to show notification when copy fails

    await navigator.clipboard.writeText(fullText)
    setIsAreaContextMenuOpen(false)
  }

  const handleDeleteButtonClick = async () => {
    const response = await requestDeleteAreaById(area.id)
    if (!response) return // TODO: change to show notification when copy fails

    setIsAreaContextMenuOpen(false)
  }

  const handleReprocessButtonClick = async () => {
    const documentId = getSelectedDocument()?.id
    if (!documentId) return // TODO: change to show notification when copy fails

    setIsAreaContextMenuOpen(false) // TODO: possibly have loading animation and wait until after process
    await processImageArea(documentId, area.id)
  }

  return <Html>
    <form style={makeFormStyles()} onBlur={handleBlur}>
      <a
        tabIndex={-1}
        style={{ ...sharedButtonStyles, ...reprocessButtonColors.normal}}
        onClick={(e) => asyncClick(e, handleCopyButtonClick)}
        onMouseEnter={(e) => {setMutableStylesOnElement(e, copyButtonColors.hover)} }
        onMouseLeave={(e) => {setMutableStylesOnElement(e, copyButtonColors.normal)} }>
        Copy Area
      </a>
      <a
        tabIndex={-1}
        style={{ ...sharedButtonStyles, ...reprocessButtonColors.normal}}
        onClick={(e) => asyncClick(e, handleReprocessButtonClick)}
        onMouseEnter={(e) => {setMutableStylesOnElement(e, reprocessButtonColors.hover)} }
        onMouseLeave={(e) => {setMutableStylesOnElement(e, reprocessButtonColors.normal)} }>
        Reprocess
      </a>
      <a
        tabIndex={-1}
        style={{ ...sharedButtonStyles, ...deleteButtonColors.normal}}
        onClick={(e) => asyncClick(e, handleDeleteButtonClick)}
        onMouseEnter={(e) => {setMutableStylesOnElement(e, deleteButtonColors.hover)} }
        onMouseLeave={(e) => {setMutableStylesOnElement(e, deleteButtonColors.normal)} }>
        Delete
      </a>
    </form>
  </Html>

}

export default AreaContextMenu
