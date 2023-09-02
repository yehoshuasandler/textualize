package ipc

import (
	contextGroup "textualize/core/ContextGroup"
	document "textualize/core/Document"
	"textualize/entities"
	"textualize/storage"
)

func (c *Channel) RequestDisconnectProcessedAreas(ancestorAreaId string, descendantAreaId string) bool {
	contextGroupCollection := contextGroup.GetContextGroupCollection()

	wasSuccessfulDisconnect := contextGroupCollection.DisconnectProcessedAreas(ancestorAreaId, descendantAreaId)
	if wasSuccessfulDisconnect {
		wasSuccessfulWrite := c.RequestSaveContextGroupCollection()
		return wasSuccessfulWrite
	}
	return false
}

/*
If a connection already exists, then this method will default to disconnecting the two areas.
*/
func (c *Channel) RequestConnectProcessedAreas(ancestorAreaId string, descendantAreaId string) bool {
	contextGroupCollection := contextGroup.GetContextGroupCollection()

	doesContextGroupAlreadyExist := contextGroupCollection.DoesGroupExistBetweenProcessedAreas(ancestorAreaId, descendantAreaId)
	if doesContextGroupAlreadyExist {
		return c.RequestDisconnectProcessedAreas(ancestorAreaId, descendantAreaId)
	}

	processedAreaCollection := document.GetProcessedAreaCollection()

	ancestorArea := processedAreaCollection.GetAreaById(ancestorAreaId)
	descendantArea := processedAreaCollection.GetAreaById(descendantAreaId)

	wasSuccessfulConnect := contextGroupCollection.ConnectProcessedAreas(*ancestorArea, *descendantArea)
	if wasSuccessfulConnect {
		wasSuccessfulWrite := c.RequestSaveContextGroupCollection()
		return wasSuccessfulWrite
	}

	return false
}

func (c *Channel) GetSerializedContextGroups() []entities.SerializedLinkedProcessedArea {
	contextGroupCollection := contextGroup.GetContextGroupCollection()

	serializedContextGroups := make([]entities.SerializedLinkedProcessedArea, 0)
	for _, group := range contextGroupCollection.Groups {
		serializedContextGroups = append(serializedContextGroups, group.Serialize()...)
	}

	return serializedContextGroups
}

func (c *Channel) RequestSaveContextGroupCollection() bool {
	contextGroupCollection := contextGroup.GetContextGroupCollection()
	projectName := c.GetCurrentSession().Project.Name

	serializedContextGroups := make([]entities.SerializedLinkedProcessedArea, 0)
	for _, group := range contextGroupCollection.Groups {
		serializedContextGroups = append(serializedContextGroups, group.Serialize()...)
	}

	successfulWrite := storage.GetDriver().WriteContextGroupCollection(serializedContextGroups, projectName)
	return successfulWrite
}
