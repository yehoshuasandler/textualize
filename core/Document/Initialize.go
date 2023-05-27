package document

import "textualize/entities"

func InitializeModule() {
	GetDocumentCollection()
	GetGroupCollection()
}

func createTestData() {
	documentCollection := GetDocumentCollection()
	documentGroupCollection := GetGroupCollection()

	documentGroupCollection.AddDocumentGroup(entities.Group{
		Id:   "XYZ",
		Name: "Test Group One",
	})

	documentCollection.AddDocument(Entity{
		Id:      "ABC",
		GroupId: "XYZ",
		Name:    "My First Document",
	})
}
