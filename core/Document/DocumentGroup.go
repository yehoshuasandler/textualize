package document

type Group struct {
	Id        string
	ParentId  string
	ProjectId string
	Name      string
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

func (collection *GroupCollection) AddDocumentGroup(group Group) {
	collection.Groups = append(collection.Groups, group)
}
