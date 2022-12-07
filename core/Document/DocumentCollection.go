package document

type DocumentCollection struct {
	Documents []Document
	ProjectId string
}

var documentCollectionInstance *DocumentCollection

func GetDocumentCollection() *DocumentCollection {
	if documentCollectionInstance == nil {
		documentCollectionInstance = &DocumentCollection{}
	}

	return documentCollectionInstance
}

func (collection *DocumentCollection) AddDocument(document Document) {
	collection.Documents = append(collection.Documents, document)
}
