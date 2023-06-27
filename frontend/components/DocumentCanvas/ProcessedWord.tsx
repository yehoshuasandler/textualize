'use client'

import React from 'react'
import { Group, Rect, Text } from 'react-konva'
import { entities } from '../../wailsjs/wailsjs/go/models'

type Props = {
  area: entities.ProcessedArea,
  word: entities.ProcessedWord,
  scale: number,
  setEditingWord: Function
}

const ProcessedWord = (props: Props) => {
  const { area, scale,  word, setEditingWord } = props
  const { x0, x1, y0, y1 } = word.boundingBox

  return <Group
    id={word.id}
    areaId={area.id}
    isProcessedWord
    onDblClick={() => setEditingWord(word)}>
    <Rect
      id={word.id}
      areaId={area.id}
      width={x1 - x0}
      height={y1 - y0}
      scale={{ x: scale, y: scale }}
      x={x0 * scale}
      y={y1 * scale}
      strokeEnabled={false}
      shadowForStrokeEnabled={false}
      strokeScaleEnabled={false}
      cornerRadius={4}
      fill='rgb(80,80,80)'
      opacity={0.4}
      shadowColor='rgb(180,180,180)'
      shadowBlur={10}
      shadowOffset={{ x: 10, y: 10 }} />
    <Text text={word.fullText}
      width={x1 - x0}
      height={y1 - y0}
      scale={{ x: scale, y: scale }}
      x={x0 * scale}
      y={y1 * scale}
      align='center'
      verticalAlign='middle'
      fontSize={36}
      fontFamily='Calibri'
      fill='white'
      strokeScaleEnabled={false}
      shadowForStrokeEnabled={false}
    />
  </Group >
}

export default ProcessedWord