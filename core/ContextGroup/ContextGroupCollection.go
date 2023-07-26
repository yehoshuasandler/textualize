package contextGroup

import (
	"fmt"
	"textualize/entities"
)

type ContextGroupCollection struct {
	Groups []entities.LinkedAreaList
}

var contextGroupCollectionInstance *ContextGroupCollection

func GetContextGroupCollection() *ContextGroupCollection {
	if contextGroupCollectionInstance == nil {
		contextGroupCollectionInstance = &ContextGroupCollection{}
	}
	return contextGroupCollectionInstance
}

func SetContextGroupCollection(collection ContextGroupCollection) *ContextGroupCollection {
	contextGroupCollectionInstance = &collection
	return contextGroupCollectionInstance
}

func SetContextGroupCollectionBySerialized(serialized []entities.SerializedLinkedProcessedArea) *ContextGroupCollection {
	newInstance := ContextGroupCollection{}

	newInstance.Groups = append(newInstance.Groups, entities.DeserializeLinkedAreaList(serialized))

	SetContextGroupCollection(newInstance)
	return &newInstance
}

func (collection *ContextGroupCollection) FindGroupById(id string) (*entities.LinkedAreaList, error) {
	found := false
	var foundGroup *entities.LinkedAreaList = nil
	for _, group := range collection.Groups {
		if group.Id == id {
			found = true
			foundGroup = &group
		}
	}
	if !found {
		return nil, fmt.Errorf("ContextGroupCollection.FindGroupById: Group with id %s not found", id)
	}
	return foundGroup, nil
}

func (collection *ContextGroupCollection) FindGroupByLinkedProcessedAreaId(id string) (*entities.LinkedAreaList, error) {
	found := false
	var foundGroup *entities.LinkedAreaList = nil
	for _, group := range collection.Groups {
		for n := group.First(); n != nil && !found; n = n.GetNext() {
			if n.Area.Id == id {
				found = true
				foundGroup = &group
			}
		}
	}
	if !found {
		return nil, fmt.Errorf("ContextGroupCollection.FindGroupByLinkedProcessedAreaId: Group with LinkedProcessedArea.Id %s not found", id)
	}
	return foundGroup, nil
}

func (collection *ContextGroupCollection) ConnectProcessedAreas(ancestorNode entities.ProcessedArea, descendantNode entities.ProcessedArea) bool {
	ancestorGroup, _ := collection.FindGroupByLinkedProcessedAreaId(ancestorNode.Id)
	descendantGroup, _ := collection.FindGroupByLinkedProcessedAreaId(descendantNode.Id)

	isAncestorInAnyInGroup := ancestorGroup != nil
	isDescendantInAnyInGroup := descendantGroup != nil
	isEitherInAnyInGroup := isAncestorInAnyInGroup || isDescendantInAnyInGroup
	areBothInAnyInGroup := isAncestorInAnyInGroup && isDescendantInAnyInGroup
	areBothInSameGroup := false
	if areBothInAnyInGroup {
		areBothInSameGroup = ancestorGroup.Id == descendantGroup.Id
	}

	if areBothInSameGroup {
		return true
	}

	if !isEitherInAnyInGroup {
		collection.createNewGroupAndConnectNodes(ancestorNode, descendantNode)
		return true
	}

	if isAncestorInAnyInGroup && !isDescendantInAnyInGroup {
		ancestorGroup.InsertAfter(ancestorNode.Id, descendantNode)
		return true
	}

	if !isAncestorInAnyInGroup && isDescendantInAnyInGroup {
		descendantGroup.InsertBefore(descendantNode.Id, ancestorNode)
		return true
	}

	return false
}

func (collection *ContextGroupCollection) createNewGroupAndConnectNodes(ancestorNode entities.ProcessedArea, descendantNode entities.ProcessedArea) {
	newGroup := entities.LinkedAreaList{
		Id:         ancestorNode.Id,
		DocumentId: ancestorNode.DocumentId,
		Head:       &entities.LinkedProcessedArea{Area: ancestorNode},
		Tail:       &entities.LinkedProcessedArea{Area: descendantNode},
	}
	newGroup.Head.Next = newGroup.Tail
	newGroup.Tail.Previous = newGroup.Head
	collection.Groups = append(collection.Groups, newGroup)
}
