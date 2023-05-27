package document

import "textualize/entities"

type Group entities.Group

type GroupCollection entities.GroupCollection

var groupCollectionInstance *GroupCollection

func GetGroupCollection() *GroupCollection {
	if groupCollectionInstance == nil {
		groupCollectionInstance = &GroupCollection{}
	}

	return groupCollectionInstance
}

func SetGroupCollection(collection GroupCollection) *GroupCollection {
	groupCollectionInstance = &collection
	return groupCollectionInstance
}

func (collection *GroupCollection) AddDocumentGroup(group entities.Group) {
	collection.Groups = append(collection.Groups, group)
}

func (collection *GroupCollection) GetGroupById(groupId string) *entities.Group {
	var foundGroup *entities.Group

	for index, g := range collection.Groups {
		if g.Id == groupId {
			foundGroup = &collection.Groups[index]
		}
	}
	return foundGroup
}
