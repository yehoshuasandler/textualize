package document

func InitizeModule() {
	GetDocumentCollection()
	GetGroupCollection()
}

func createTestData() {
	documentCollection := GetDocumentCollection()
	documentGroupCollection := GetGroupCollection()

	documentGroupCollection.AddDocumentGroup(Group{
		Id:   "XYZ",
		Name: "Test Group One",
	})

	documentCollection.AddDocument(Entity{
		Id:      "ABC",
		GroupId: "XYZ",
		Name:    "My First Document",
	})
}
