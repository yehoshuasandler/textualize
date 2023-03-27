package document

type DocumentCollection struct {
	Documents []Entity
	ProjectId string
}

var documentCollectionInstance *DocumentCollection

func GetDocumentCollection() *DocumentCollection {
	if documentCollectionInstance == nil {
		documentCollectionInstance = &DocumentCollection{}
	}

	return documentCollectionInstance
}

func (collection *DocumentCollection) AddDocument(document Entity) {
	collection.Documents = append(collection.Documents, document)
}

func SetDocumentCollection(collection DocumentCollection) *DocumentCollection {
	documentCollectionInstance = &collection
	return documentCollectionInstance
}

func (collection *DocumentCollection) GetDocumentById(id string) *Entity {
	var foundDocument *Entity

	for index, d := range collection.Documents {
		if d.Id == id {
			foundDocument = &collection.Documents[index]
			break
		}
	}

	return foundDocument
}

func (collection *DocumentCollection) GetDocumentByAreaId(areaId string) *Entity {
	var foundDocument *Entity

	for dIndex, d := range collection.Documents {
		for _, a := range d.Areas {
			if a.Id == areaId {
				foundDocument = &collection.Documents[dIndex]
			}
		}
	}

	return foundDocument
}
