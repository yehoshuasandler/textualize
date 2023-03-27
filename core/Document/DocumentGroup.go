package document

type Group struct {
	Id        string
	ParentId  string
	ProjectId string
	Name      string
	Order     int
}

type GroupCollection struct {
	Id        string
	Groups    []Group
	ProjectId string
}

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

func (collection *GroupCollection) AddDocumentGroup(group Group) {
	collection.Groups = append(collection.Groups, group)
}

func (collection *GroupCollection) GetGroupById(groupId string) *Group {
	var foundGroup *Group

	for index, g := range collection.Groups {
		if g.Id == groupId {
			foundGroup = &collection.Groups[index]
		}
	}
	return foundGroup
}
