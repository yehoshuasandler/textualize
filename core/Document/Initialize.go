package document

func InitizeModule() {
	GetDocumentCollection()
	GetDocumentGroupCollection()
}

func createTestData() {
	documentCollection := GetDocumentCollection()
	documentGroupCollection := GetDocumentGroupCollection()

	documentGroupCollection.AddDocumentGroup(DocumentGroup{
		Id:   "XYZ",
		Name: "Test Group One",
	})

	documentCollection.AddDocument(Document{
		Id:      "ABC",
		GroupId: "XYZ",
		Name:    "My First Document",
	})
}
