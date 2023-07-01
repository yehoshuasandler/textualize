package ipc

import (
	"fmt"
	"sort"
	app "textualize/core/App"
	document "textualize/core/Document"
	session "textualize/core/Session"
	"textualize/entities"
	storage "textualize/storage"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type GetDocumentsResponse struct {
	Documents []entities.Document `json:"documents"`
	Groups    []entities.Group    `json:"groups"`
}

func (c *Channel) GetDocumentById(id string) entities.Document {
	foundDocument := document.GetDocumentCollection().GetDocumentById(id)
	return entities.Document(*foundDocument)
}

func (c *Channel) GetDocuments() GetDocumentsResponse {
	documents := document.GetDocumentCollection().Documents
	groups := document.GetGroupCollection().Groups

	response := GetDocumentsResponse{
		Groups:    make([]entities.Group, 0),
		Documents: make([]entities.Document, 0),
	}

	for _, d := range documents {
		sortedAreas := d.Areas
		sort.Slice(sortedAreas, func(i, j int) bool {
			return sortedAreas[i].Order < sortedAreas[j].Order
		})

		jsonDocument := entities.Document(d)
		d.Areas = sortedAreas
		response.Documents = append(response.Documents, jsonDocument)
	}

	if len(groups) > 0 {
		sortedGroups := groups
		sort.Slice(sortedGroups, func(i, j int) bool {
			return sortedGroups[i].Order < sortedGroups[j].Order
		})
		response.Groups = sortedGroups
	}

	return response
}

func (c *Channel) RequestAddDocument(groupId string, documentName string) entities.Document {
	filePath, err := runtime.OpenFileDialog(app.GetInstance().Context, runtime.OpenDialogOptions{
		Title: "Select an Image",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Image Files (*.jpg, *.png)",
				Pattern:     "*.jpg;*.png",
			},
		},
	})

	if err != nil {
		runtime.LogError(app.GetInstance().Context, err.Error())
		return entities.Document{}
	}

	newDocument := document.Entity{
		Id:        uuid.NewString(),
		Name:      documentName,
		Path:      filePath,
		GroupId:   groupId,
		ProjectId: session.GetInstance().Project.Id,
	}

	document.GetDocumentCollection().AddDocument(newDocument)

	return entities.Document(newDocument)
}

func (c *Channel) deleteDocumentById(documentId string) bool {
	collection := document.GetDocumentCollection()

	documentToDeleteIndex := -1
	for i, d := range collection.Documents {
		if d.Id == documentId {
			documentToDeleteIndex = i
			break
		}
	}

	if documentToDeleteIndex < 0 {
		return false
	}

	collection.Documents[documentToDeleteIndex] = collection.Documents[len(collection.Documents)-1]
	collection.Documents = collection.Documents[:len(collection.Documents)-1]
	return true
}

func (c *Channel) RequestUpdateDocumentUserMarkdown(documentId string, markdown string) entities.UserMarkdown {
	markdownCollection := document.GetUserMarkdownCollection()
	markdownToUpdate := markdownCollection.GetUserMarkdownByDocumentId(documentId)

	newMarkdown := entities.UserMarkdown{
		DocumentId: documentId,
		Value:      markdown,
	}
	if markdownToUpdate == nil {
		newMarkdown.Id = uuid.NewString()
	} else {
		newMarkdown.Id = markdownToUpdate.Id
	}

	updatedMarkdown := markdownCollection.UpdateUserMarkdown(newMarkdown)
	return entities.UserMarkdown(updatedMarkdown)
}

func (c *Channel) deleteDocumentUserMarkdown(documentId string) bool {
	collection := document.GetUserMarkdownCollection()

	markdownToDeleteIndex := -1
	for i, d := range collection.Values {
		if d.DocumentId == documentId {
			markdownToDeleteIndex = i
			break
		}
	}

	if markdownToDeleteIndex < 0 {
		return false
	}

	collection.Values[markdownToDeleteIndex] = collection.Values[len(collection.Values)-1]
	collection.Values = collection.Values[:len(collection.Values)-1]
	return true
}

func (c *Channel) GetUserMarkdownByDocumentId(documentId string) entities.UserMarkdown {
	foundUserMarkdown := document.GetUserMarkdownCollection().GetUserMarkdownByDocumentId((documentId))
	return entities.UserMarkdown(*foundUserMarkdown)
}

func (c *Channel) RequestAddDocumentGroup(name string) entities.Group {
	groupCollection := document.GetGroupCollection()

	newGroup := entities.Group{
		Id:        uuid.NewString(),
		Name:      name,
		ProjectId: session.GetInstance().Project.Id,
		Order:     len(groupCollection.Groups),
	}

	groupCollection.AddDocumentGroup(newGroup)

	return newGroup
}

func (c *Channel) RequestChangeGroupOrder(groupId string, newOrder int) entities.Group {
	groupCollection := document.GetGroupCollection()

	for _, g := range groupCollection.Groups {
		if g.Id == groupId {
			document.GetGroupCollection().GetGroupById(groupId).Order = newOrder
		} else if g.Order >= newOrder {
			document.GetGroupCollection().GetGroupById(groupId).Order = g.Order + 1
		}
	}

	return *document.GetGroupCollection().GetGroupById(groupId)
}

func (c *Channel) GetAreaById(areaId string) entities.Area {
	foundDocument := document.GetDocumentCollection().GetDocumentByAreaId(areaId)

	if len(foundDocument.Areas) == 0 {
		return entities.Area{}
	}

	var foundArea entities.Area
	for i, a := range foundDocument.Areas {
		if a.Id == areaId {
			foundArea = foundDocument.Areas[i]
		}
	}

	return foundArea
}

func (c *Channel) RequestAddArea(documentId string, area entities.Area) entities.Area {
	foundDocument := document.GetDocumentCollection().GetDocumentById(documentId)

	var id string
	if area.Id == "" {
		id = uuid.NewString()
	} else {
		id = area.Id
	}

	order := area.Order
	if order < 1 {
		order = len(foundDocument.Areas)
	}

	newArea := entities.Area{
		Id:       id,
		Name:     area.Name,
		StartX:   area.StartX,
		EndX:     area.EndX,
		StartY:   area.StartY,
		EndY:     area.EndY,
		Order:    order,
		Language: entities.Language(area.Language),
	}
	foundDocument.AddArea(newArea)

	return newArea
}

func (c *Channel) RequestUpdateArea(updatedArea entities.Area) bool {
	documentOfArea := document.GetDocumentCollection().GetDocumentByAreaId(updatedArea.Id)

	if documentOfArea.Id == "" {
		return false
	}

	areaToUpdate := documentOfArea.GetAreaById(updatedArea.Id)

	if areaToUpdate.Id == "" {
		return false
	}

	if updatedArea.Name != "" {
		areaToUpdate.Name = updatedArea.Name
	}
	if updatedArea.Order != areaToUpdate.Order {
		areaToUpdate.Order = updatedArea.Order
	}
	if updatedArea.Language.ProcessCode != "" {
		areaToUpdate.Language = updatedArea.Language
	}

	fmt.Println(areaToUpdate.Language)
	fmt.Println(documentOfArea.GetAreaById(updatedArea.Id))

	return true
}

func (c *Channel) RequestDeleteAreaById(areaId string) bool {
	documentOfArea := document.GetDocumentCollection().GetDocumentByAreaId(areaId)

	if documentOfArea.Id == "" {
		return false
	}

	areaToDeleteIndex := -1

	for i, a := range documentOfArea.Areas {
		if a.Id == areaId {
			areaToDeleteIndex = i
			break
		}
	}

	if areaToDeleteIndex < 0 {
		return false
	}

	documentOfArea.Areas[areaToDeleteIndex] = documentOfArea.Areas[len(documentOfArea.Areas)-1]
	documentOfArea.Areas = documentOfArea.Areas[:len(documentOfArea.Areas)-1]
	return true

}

func (c *Channel) RequestUpdateDocument(updatedDocument entities.Document) entities.Document {
	documentToUpdate := document.GetDocumentCollection().GetDocumentById(updatedDocument.Id)

	if documentToUpdate == nil {
		return entities.Document{}
	}

	if updatedDocument.Id != "" {
		documentToUpdate.Id = updatedDocument.Id
	}
	if updatedDocument.Name != "" {
		documentToUpdate.Name = updatedDocument.Name
	}
	if updatedDocument.GroupId != "" {
		documentToUpdate.GroupId = updatedDocument.GroupId
	}
	if updatedDocument.Path != "" {
		documentToUpdate.Path = updatedDocument.Path
	}
	if updatedDocument.DefaultLanguage.DisplayName != "" {
		documentToUpdate.DefaultLanguage = updatedDocument.DefaultLanguage
	}

	return updatedDocument
}

func (c *Channel) RequestChangeAreaOrder(areaId string, newOrder int) entities.Document {
	documentOfArea := document.GetDocumentCollection().GetDocumentByAreaId((areaId))

	if documentOfArea == nil {
		return entities.Document{}
	}

	var foundArea entities.Area
	for _, a := range documentOfArea.Areas {
		if a.Id == areaId {
			foundArea = a
			break
		}
	}

	if foundArea.Id == "" {
		return entities.Document{}
	}

	processedAreasCollection := document.GetProcessedAreaCollection()

	for index, a := range documentOfArea.Areas {
		if a.Id == areaId {
			documentOfArea.Areas[index].Order = newOrder
			foundProcessedArea := processedAreasCollection.GetAreaById(a.Id)
			if foundProcessedArea != nil {
				foundProcessedArea.Order = newOrder
			}
		} else if a.Order >= newOrder {
			documentOfArea.Areas[index].Order = a.Order + 1
			foundProcessedArea := processedAreasCollection.GetAreaById(a.Id)
			if foundProcessedArea != nil {
				foundProcessedArea.Order = a.Order + 1
			}
		}
	}

	return c.GetDocumentById(documentOfArea.Id)
}

func (c *Channel) RequestSaveDocumentCollection() bool {
	documentCollection := document.GetDocumentCollection()
	projectName := c.GetCurrentSession().Project.Name

	fullProject := storage.GetDriver().ReadProjectDataByName(projectName)

	if fullProject.Id == "" {
		return false
	}

	documentCount := len(documentCollection.Documents)
	writableDocuments := make([]entities.Document, documentCount)
	for i := 0; i < documentCount; i++ {
		writableDocuments[i] = entities.Document(documentCollection.Documents[i])
	}

	successfulWrite := storage.GetDriver().WriteDocumentCollection(
		entities.DocumentCollection{
			ProjectId: fullProject.Id,
			Documents: writableDocuments,
		},
		projectName)

	return successfulWrite
}

func (c *Channel) RequestSaveGroupCollection() bool {
	groupCollection := document.GetGroupCollection()
	projectName := c.GetCurrentSession().Project.Name

	fullProject := storage.GetDriver().ReadProjectDataByName(projectName)

	if fullProject.Id == "" {
		return false
	}

	groupCount := len(groupCollection.Groups)
	writableGroups := make([]entities.Group, groupCount)
	for i := 0; i < groupCount; i++ {
		writableGroups[i] = entities.Group(groupCollection.Groups[i])
	}

	successfulWrite := storage.GetDriver().WriteGroupCollection(entities.GroupCollection{
		Id:        groupCollection.Id,
		ProjectId: groupCollection.ProjectId,
		Groups:    writableGroups,
	}, projectName)

	return successfulWrite
}

func (c *Channel) RequestSaveProcessedTextCollection() bool {
	processedAreaCollection := document.GetProcessedAreaCollection()
	projectName := c.GetCurrentSession().Project.Name

	processedAreasCount := len(processedAreaCollection.Areas)
	writableProcessedAreasAreas := make([]entities.ProcessedArea, processedAreasCount)
	for i := 0; i < processedAreasCount; i++ {
		writableProcessedAreasAreas[i] = entities.ProcessedArea(processedAreaCollection.Areas[i])
	}

	successfulWrite := storage.GetDriver().WriteProcessedTextCollection(
		entities.ProcessedTextCollection{
			Areas: writableProcessedAreasAreas,
		},
		projectName,
	)
	return successfulWrite
}

func (c *Channel) RequestSaveLocalUserProcessedMarkdownCollection() bool {
	userProcessedMarkdownCollection := document.GetUserMarkdownCollection()
	projectName := c.GetCurrentSession().Project.Name

	fullProject := storage.GetDriver().ReadProjectDataByName(projectName)

	if fullProject.Id == "" {
		return false
	}

	groupCount := len(userProcessedMarkdownCollection.Values)
	writableMarkdownValues := make([]entities.ProcessedUserMarkdown, groupCount)
	for i := 0; i < groupCount; i++ {
		writableMarkdownValues[i] = entities.ProcessedUserMarkdown(userProcessedMarkdownCollection.Values[i])
	}

	successfulWrite := storage.GetDriver().WriteProcessedUserMarkdownCollection(
		entities.ProcessedUserMarkdownCollection{
			Values: writableMarkdownValues,
		},
		projectName,
	)

	return successfulWrite
}

func (c *Channel) RequestDeleteDocumentAndChildren(documentId string) bool {
	success := true

	deletedDocument := c.deleteDocumentById(documentId)
	if !deletedDocument {
		success = false
	}

	deletedUserMarkDown := c.deleteDocumentUserMarkdown(documentId)
	if !deletedUserMarkDown {
		success = false
	}

	return success
}
