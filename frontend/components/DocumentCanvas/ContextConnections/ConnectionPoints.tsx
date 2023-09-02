'use client'

import { Circle, Group } from 'react-konva'
import { useStage } from '../context/provider'
import { entities } from '../../../wailsjs/wailsjs/go/models'
import { KonvaEventObject } from 'konva/lib/Node'
import { useProject } from '../../../context/Project/provider'

type Props = { areas: entities.Area[] }
const ConnectionPoints = (props: Props) => {
  const { isLinkAreaContextsVisible, scale, startingContextConnection, setStartingContextConnection } = useStage()
  const { requestConnectProcessedAreas } = useProject()

  const handleContextAreaMouseDown = async (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true
    const clickedConnectionPoint = {
      isHead: e.currentTarget.attrs.isHead,
      areaId: e.currentTarget.attrs.id
    }

    if (!startingContextConnection) return setStartingContextConnection(clickedConnectionPoint)

    if (clickedConnectionPoint.isHead === startingContextConnection.isHead
      || clickedConnectionPoint.areaId === startingContextConnection.areaId)
      return setStartingContextConnection(null)

    const headId = startingContextConnection.isHead ? startingContextConnection.areaId : clickedConnectionPoint.areaId
    const tailId = !startingContextConnection.isHead ? startingContextConnection.areaId : clickedConnectionPoint.areaId
    setStartingContextConnection(null)

    try {
      await requestConnectProcessedAreas(headId, tailId)
    } catch (err) {
      console.warn('RequestConnectProcessedAreas', err)
    }
  }

  const renderConnectingPointsForArea = (a: entities.Area) => {
    if (!isLinkAreaContextsVisible) return <></>

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

    if (!startingContextConnection) connectorsToRender = [headConnector, tailConnector]
    else if (startingContextConnection.isHead) connectorsToRender = [tailConnector]
    else connectorsToRender = [headConnector]

    if (startingContextConnection?.areaId === a.id) {
      let y = (startingContextConnection.isHead ? a.startY : a.endY) * scale
      connectorsToRender.push(<Circle
        key={`active-${a.id}`}
        id={a.id}
        radius={10}
        x={((a.startX + a.endX) * scale) / 2}
        y={y}
        strokeEnabled={false}
        fill={startingContextConnection.isHead ? '#dc8dec' : '#1e1e1e'}
        strokeScaleEnabled={false}
        shadowForStrokeEnabled={false}
        isHead={startingContextConnection.isHead}
        onMouseDown={() => setStartingContextConnection(null)}
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
