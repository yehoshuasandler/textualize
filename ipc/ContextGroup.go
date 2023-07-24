package ipc

import (
	document "textualize/core/Document"
	"textualize/entities"
)

func (c *Channel) RequestConnectAreaAsTailToNode(tailId string, headId string) bool {
	processedAreaOfTail := document.GetProcessedAreaCollection().GetAreaById(tailId)
	if processedAreaOfTail == nil {
		return false
	}

	processedAreaOfHead := document.GetProcessedAreaCollection().GetAreaById(headId)
	if processedAreaOfHead == nil {
		return false
	}

	entities.GetContextGroupCollection().ConnectAreaAsTailToNode(*processedAreaOfTail, *processedAreaOfHead)

	return true
}
