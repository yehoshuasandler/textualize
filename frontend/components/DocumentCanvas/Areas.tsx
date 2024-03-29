'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Group } from 'react-konva'
import { useProject } from '../../context/Project/provider'
import { entities } from '../../wailsjs/wailsjs/go/models'
import Area from './Area'
import ProcessedWord from './ProcessedWord'
import EditingWord from './EditingWord'
import { RootState } from '../../redux/store'

type Props = { scale: number }

const Areas = ({ scale }: Props) => {
  const { areProcessedWordsVisible } = useSelector((state: RootState) => state.stage)
  const { getSelectedDocument, selectedAreaId, getProcessedAreaById } = useProject()
  const areas = getSelectedDocument()?.areas || []
  const [editingWord, setEditingWord] = useState<entities.ProcessedWord | null>(null)
  const [selectedProcessedArea, setSelectedProcessedArea] = useState<entities.ProcessedArea | null>(null)

  useEffect(() => {
    if (!selectedAreaId) return setSelectedProcessedArea(null)
    else {
      getProcessedAreaById(selectedAreaId).then(res => {
        if (res) setSelectedProcessedArea(res)
      }).catch(err => {
        console.warn('getProcessedAreaById', err)
        setSelectedProcessedArea(null)
      })
    }

  }, [selectedAreaId])

  const renderEditingWord = () => {
    if (!editingWord) return
    return <EditingWord
      scale={scale}
      editingWord={editingWord}
      setEditingWord={setEditingWord}
    />
  }

  const renderProcessedWords = () => {
    if (!selectedProcessedArea) return <></>

      const words = selectedProcessedArea.lines.map(l => l.words).flat()
      return words.map((w, index) => <ProcessedWord
        key={index}
        area={selectedProcessedArea}
        word={w}
        scale={scale}
        setEditingWord={setEditingWord}
      />)
  }

  const renderAreas = (areas: entities.Area[]) => areas.map((a, index) => {
    return <Area key={index} area={a} isActive={a.id === selectedAreaId} />
  })

  return <Group>
    {renderAreas(areas)}
    {areProcessedWordsVisible ? renderProcessedWords() : <></>}
    {areProcessedWordsVisible ? renderEditingWord() : <></>}
  </Group>
}

export default Areas



