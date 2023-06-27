'use client'

import React, { useState } from 'react'
import { Group } from 'react-konva'
import { useProject } from '../../context/Project/provider'
import { entities } from '../../wailsjs/wailsjs/go/models'
import Area from './Area'
import ProcessedWord from './ProcessedWord'
import EditingWord from './EditingWord'

type Props = { scale: number }

const Areas = ({ scale }: Props) => {
  const { getSelectedDocument, selectedAreaId } = useProject()
  const areas = getSelectedDocument()?.areas || []
  const [hoveredOverAreaIds, setHoveredOverAreaIds] = useState<string[]>([])
  const [hoveredProcessedAreas, setHoveredProcessedArea] = useState<entities.ProcessedArea[]>([])
  const [editingWord, setEditingWord] = useState<entities.ProcessedWord | null>(null)

  const renderEditingWord = () => {
    if (!editingWord) return
    return <EditingWord
      scale={scale}
      editingWord={editingWord}
      setEditingWord={setEditingWord}
    />
  }

  const renderProcessedWords = () => {
    if (!hoveredProcessedAreas.length) return

    return hoveredProcessedAreas.map(a => {
      const words = a.lines.map(l => l.words).flat()
      return words.map((w, index) => <ProcessedWord
        key={index}
        area={a}
        word={w}
        scale={scale}
        setEditingWord={setEditingWord}
      />)
    })
  }

  const renderAreas = (areas: entities.Area[]) => areas.map((a, index) => {
    return <Area key={index}
      area={a}
      scale={scale}
      setHoveredOverAreaIds={setHoveredOverAreaIds}
      setHoveredProcessedArea={setHoveredProcessedArea}
      isActive={(hoveredOverAreaIds.includes(a.id) || a.id === selectedAreaId)} />
  })

  return <Group>
    {renderAreas(areas)}
    {renderProcessedWords()}
    {renderEditingWord()}
  </Group>
}

export default Areas



