package document

type DocumentGroup struct {
	Id        string
	ParentId  string
	ProjectId string
	Name      string
}

type DocumentGroupCollection struct {
	Id             string
	DocumentGroups []DocumentGroup
	ProjectId      string
}

var documentGroupCollectionInstance *DocumentGroupCollection

func GetDocumentGroupCollection() *DocumentGroupCollection {
	if documentGroupCollectionInstance == nil {
		documentGroupCollectionInstance = &DocumentGroupCollection{}
	}

	return documentGroupCollectionInstance
}

func (collection *DocumentGroupCollection) AddDocumentGroup(group DocumentGroup) {
	collection.DocumentGroups = append(collection.DocumentGroups, group)
}
