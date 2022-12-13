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
