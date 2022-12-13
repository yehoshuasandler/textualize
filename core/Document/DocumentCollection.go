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

func (collection *DocumentCollection) GetDocumentById(id string) Entity {
	var foundDocument Entity

	for _, d := range collection.Documents {
		if d.Id == id {
			foundDocument = d
			break
		}
	}

	return foundDocument
}
