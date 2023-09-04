'use client'

import { Circle, Group } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'
import { entities } from '../../../wailsjs/wailsjs/go/models'
import { KonvaEventObject } from 'konva/lib/Node'
import { useProject } from '../../../context/Project/provider'
import { RootState } from '../../../redux/store'
import { setStartingContextConnectionPoint } from '../../../redux/features/stage/stageSlice'

type Props = { areas: entities.Area[] }
const ConnectionPoints = (props: Props) => {
  const dispatch = useDispatch()
  const { scale, areLinkAreaContextsVisible, startingContextConnectionPoint } = useSelector((state: RootState) => state.stage)

  const { requestConnectProcessedAreas } = useProject()

  const handleContextAreaMouseDown = async (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true
    const clickedConnectionPoint = {
      isHead: e.currentTarget.attrs.isHead,
      areaId: e.currentTarget.attrs.id
    }

    if (!startingContextConnectionPoint) return dispatch(setStartingContextConnectionPoint(clickedConnectionPoint))

    if (clickedConnectionPoint.isHead === startingContextConnectionPoint.isHead
      || clickedConnectionPoint.areaId === startingContextConnectionPoint.areaId)
      return dispatch(setStartingContextConnectionPoint(null))

    const headId = startingContextConnectionPoint.isHead ? startingContextConnectionPoint.areaId : clickedConnectionPoint.areaId
    const tailId = !startingContextConnectionPoint.isHead ? startingContextConnectionPoint.areaId : clickedConnectionPoint.areaId
    dispatch(setStartingContextConnectionPoint(null))

    try {
      await requestConnectProcessedAreas(headId, tailId)
    } catch (err) {
      console.warn('RequestConnectProcessedAreas', err)
    }
  }

  const renderConnectingPointsForArea = (a: entities.Area) => {
    if (!areLinkAreaContextsVisible) return <></>

    const headConnector = <Circle
      key={`head-${a.id}`}
      id={a.id}
      radius={8}
      x={((a.startX + a.endX) * scale) / 2}
      y={a.startY * scale}
      strokeEnabled={false}
      fill='#dc8dec'
      strokeScaleEnabled={false}
      shadowForStrokeEnabled={false}
      onMouseDown={handleContextAreaMouseDown}
      isHead
    />

    const tailConnector = <Circle
      key={`tail-${a.id}`}
      id={a.id}
      radius={10}
      x={((a.startX + a.endX) * scale) / 2}
      y={a.endY * scale}
      strokeEnabled={false}
      fill='#1e1e1e'
      strokeScaleEnabled={false}
      shadowForStrokeEnabled={false}
      onMouseDown={handleContextAreaMouseDown}
      isHead={false}
    />

    let connectorsToRender = []

    if (!startingContextConnectionPoint) connectorsToRender = [headConnector, tailConnector]
    else if (startingContextConnectionPoint.isHead) connectorsToRender = [tailConnector]
    else connectorsToRender = [headConnector]

    if (startingContextConnectionPoint?.areaId === a.id) {
      let y = (startingContextConnectionPoint.isHead ? a.startY : a.endY) * scale
      connectorsToRender.push(<Circle
        key={`active-${a.id}`}
        id={a.id}
        radius={10}
        x={((a.startX + a.endX) * scale) / 2}
        y={y}
        strokeEnabled={false}
        fill={startingContextConnectionPoint.isHead ? '#dc8dec' : '#1e1e1e'}
        strokeScaleEnabled={false}
        shadowForStrokeEnabled={false}
        isHead={startingContextConnectionPoint.isHead}
        onMouseDown={() => dispatch(setStartingContextConnectionPoint(null))}
      />)
    }

    return <Group key={`group-${a.id}`}>
      {connectorsToRender}
    </Group>
  }

  const renderAllConnectingPoints = () => props.areas.map(a => renderConnectingPointsForArea(a))

  return <Group>
    {renderAllConnectingPoints()}
  </Group>

}

export default ConnectionPoints
