package ipc

import (
	"sort"
	app "textualize/core/App"
	consts "textualize/core/Consts"
	document "textualize/core/Document"
	session "textualize/core/Session"
	storage "textualize/storage"
	storageEntity "textualize/storage/Entities"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type GetDocumentsResponse struct {
	Documents []Document `json:"documents"`
	Groups    []Group    `json:"groups"`
}

func (c *Channel) GetDocumentById(id string) Document {
	foundDocument := document.GetDocumentCollection().GetDocumentById(id)
	var jsonAreas []Area

	for _, a := range foundDocument.Areas {
		jsonAreas = append(jsonAreas, Area{
			Id:       a.Id,
			Name:     a.Name,
			StartX:   a.StartX,
			StartY:   a.StartY,
			EndX:     a.EndX,
			EndY:     a.EndY,
			Order:    a.Order,
			Language: Language(a.Language),
		})
	}
	response := Document{
		Id:              foundDocument.Id,
		Name:            foundDocument.Name,
		GroupId:         foundDocument.GroupId,
		Path:            foundDocument.Path,
		ProjectId:       foundDocument.ProjectId,
		Areas:           jsonAreas,
		DefaultLanguage: Language(foundDocument.DefaultLanguage),
	}
	return response
}

func (c *Channel) GetDocuments() GetDocumentsResponse {
	documents := document.GetDocumentCollection().Documents
	groups := document.GetGroupCollection().Groups

	response := GetDocumentsResponse{
		Groups:    make([]Group, 0),
		Documents: make([]Document, 0),
	}

	for _, d := range documents {
		jsonAreas := make([]Area, 0)
		for _, a := range d.Areas {
			jsonAreas = append(jsonAreas, Area{
				Id:       a.Id,
				Name:     a.Name,
				StartX:   a.StartX,
				StartY:   a.StartY,
				EndX:     a.EndX,
				EndY:     a.EndY,
				Order:    a.Order,
				Language: Language(a.Language),
			})
		}

		sort.Slice(jsonAreas, func(i, j int) bool {
			return jsonAreas[i].Order < jsonAreas[j].Order
		})

		jsonDocument := Document{
			Id:              d.Id,
			GroupId:         d.GroupId,
			Name:            d.Name,
			Path:            d.Path,
			ProjectId:       d.ProjectId,
			Areas:           jsonAreas,
			DefaultLanguage: Language(d.DefaultLanguage),
		}
		response.Documents = append(response.Documents, jsonDocument)
	}

	jsonGroups := make([]Group, 0)
	for _, g := range groups {
		jsonGroup := Group{
			Id:        g.Id,
			ParentId:  g.ParentId,
			ProjectId: g.ProjectId,
			Name:      g.Name,
			Order:     g.Order,
		}
		jsonGroups = append(jsonGroups, jsonGroup)
	}

	sort.Slice(jsonGroups, func(i, j int) bool {
		return jsonGroups[i].Order < jsonGroups[j].Order
	})

	response.Groups = jsonGroups

	return response
}

func (c *Channel) RequestAddDocument(groupId string, documentName string) Document {
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
		return Document{}
	}

	newDocument := document.Entity{
		Id:        uuid.NewString(),
		Name:      documentName,
		Path:      filePath,
		GroupId:   groupId,
		ProjectId: session.GetInstance().Project.Id,
	}

	document.GetDocumentCollection().AddDocument(newDocument)

	documentResponse := Document{
		Id:        newDocument.Id,
		Name:      newDocument.Name,
		Path:      newDocument.Path,
		GroupId:   newDocument.GroupId,
		ProjectId: newDocument.ProjectId,
	}

	return documentResponse
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

func (c *Channel) RequestUpdateDocumentUserMarkdown(documentId string, markdown string) UserMarkdown {
	markdownCollection := document.GetUserMarkdownCollection()
	markdownToUpdate := markdownCollection.GetUserMarkdownByDocumentId(documentId)

	newMarkdown := document.UserMarkdown{
		DocumentId: documentId,
		Value:      markdown,
	}
	if markdownToUpdate == nil {
		newMarkdown.Id = uuid.NewString()
	} else {
		newMarkdown.Id = markdownToUpdate.Id
	}

	updatedMarkdown := markdownCollection.UpdateUserMarkdown(newMarkdown)
	return UserMarkdown{
		Id:         updatedMarkdown.Id,
		DocumentId: updatedMarkdown.DocumentId,
		Value:      updatedMarkdown.Value,
	}
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

func (c *Channel) GetUserMarkdownByDocumentId(documentId string) UserMarkdown {
	foundUserMarkdown := document.GetUserMarkdownCollection().GetUserMarkdownByDocumentId((documentId))

	response := UserMarkdown{}

	if foundUserMarkdown != nil {
		response = UserMarkdown{
			Id:         foundUserMarkdown.Id,
			DocumentId: foundUserMarkdown.DocumentId,
			Value:      foundUserMarkdown.Value,
		}
	}

	return response
}

func (c *Channel) RequestAddDocumentGroup(name string) Group {
	groupCollection := document.GetGroupCollection()

	newGroup := document.Group{
		Id:        uuid.NewString(),
		Name:      name,
		ProjectId: session.GetInstance().Project.Id,
		Order:     len(groupCollection.Groups),
	}

	groupCollection.AddDocumentGroup(newGroup)

	response := Group{
		Id:        newGroup.Id,
		Name:      newGroup.Name,
		ParentId:  newGroup.ParentId,
		ProjectId: newGroup.ProjectId,
		Order:     newGroup.Order,
	}

	return response
}

func (c *Channel) RequestChangeGroupOrder(groupId string, newOrder int) Group {
	groupCollection := document.GetGroupCollection()

	for _, g := range groupCollection.Groups {
		if g.Id == groupId {
			// document.GetGroupCollection().Groups[index].Order = newOrder
			document.GetGroupCollection().GetGroupById(groupId).Order = newOrder
		} else if g.Order >= newOrder {
			// document.GetGroupCollection().Groups[index].Order = g.Order + 1
			document.GetGroupCollection().GetGroupById(groupId).Order = g.Order + 1
		}
	}

	return Group(*document.GetGroupCollection().GetGroupById(groupId))
}

func (c *Channel) GetAreaById(areaId string) Area {
	foundDocument := document.GetDocumentCollection().GetDocumentByAreaId(areaId)

	if len(foundDocument.Areas) == 0 {
		return Area{}
	}

	var foundArea document.Area
	for i, a := range foundDocument.Areas {
		if a.Id == areaId {
			foundArea = foundDocument.Areas[i]
		}
	}

	return Area{
		Id:       foundArea.Id,
		Name:     foundArea.Name,
		StartX:   foundArea.StartX,
		EndX:     foundArea.EndX,
		StartY:   foundArea.StartY,
		EndY:     foundArea.EndY,
		Order:    foundArea.Order,
		Language: Language(foundArea.Language),
	}
}

func (c *Channel) RequestAddArea(documentId string, area Area) Area {
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

	newArea := document.Area{
		Id:       id,
		Name:     area.Name,
		StartX:   area.StartX,
		EndX:     area.EndX,
		StartY:   area.StartY,
		EndY:     area.EndY,
		Order:    order,
		Language: consts.Language(area.Language),
	}
	foundDocument.AddArea(newArea)

	responseArea := area
	responseArea.Id = id

	return responseArea
}

func (c *Channel) RequestUpdateArea(updatedArea Area) Area {
	documentOfArea := document.GetDocumentCollection().GetDocumentByAreaId(updatedArea.Id)

	if documentOfArea.Id == "" {
		return Area{}
	}

	areaToUpdate := documentOfArea.GetAreaById(updatedArea.Id)

	if areaToUpdate.Id == "" {
		return Area{}
	}

	// TODO: add more prop changes when needed
	if updatedArea.Name != "" {
		areaToUpdate.Name = updatedArea.Name
	}
	if updatedArea.Order != areaToUpdate.Order {
		areaToUpdate.Order = updatedArea.Order
	}

	return Area{
		Id:       areaToUpdate.Id,
		Name:     areaToUpdate.Name,
		StartX:   areaToUpdate.StartX,
		StartY:   areaToUpdate.StartY,
		EndX:     areaToUpdate.EndX,
		EndY:     areaToUpdate.EndY,
		Order:    areaToUpdate.Order,
		Language: Language(areaToUpdate.Language),
	}
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

func (c *Channel) RequestUpdateDocument(updatedDocument Document) Document {
	documentToUpdate := document.GetDocumentCollection().GetDocumentById(updatedDocument.Id)

	if documentToUpdate == nil {
		return Document{}
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
		documentToUpdate.DefaultLanguage = consts.Language(updatedDocument.DefaultLanguage)
	}

	return updatedDocument
}

func (c *Channel) RequestChangeAreaOrder(areaId string, newOrder int) Document {
	documentOfArea := document.GetDocumentCollection().GetDocumentByAreaId((areaId))

	if documentOfArea == nil {
		return Document{}
	}

	var foundArea document.Area
	for _, a := range documentOfArea.Areas {
		if a.Id == areaId {
			foundArea = a
			break
		}
	}

	if foundArea.Id == "" {
		return Document{}
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

	var documentsToWrite []storageEntity.Document
	for _, d := range documentCollection.Documents {
		var areasToWrite []storageEntity.Area
		for _, a := range d.Areas {
			areasToWrite = append(areasToWrite, storageEntity.Area{
				Id:       a.Id,
				Name:     a.Name,
				StartX:   a.StartX,
				StartY:   a.StartY,
				EndX:     a.EndX,
				EndY:     a.EndY,
				Language: storageEntity.Language(a.Language),
				Order:    a.Order,
			})
		}

		documentsToWrite = append(documentsToWrite, storageEntity.Document{
			Id:              d.Id,
			GroupId:         d.GroupId,
			Name:            d.Name,
			Path:            d.Path,
			ProjectId:       d.ProjectId,
			Areas:           areasToWrite,
			DefaultLanguage: storageEntity.Language(d.DefaultLanguage),
		})
	}

	successfulWrite := storage.GetDriver().WriteDocumentCollection(storageEntity.DocumentCollection{
		Documents: documentsToWrite,
		ProjectId: fullProject.Id,
	}, projectName)

	return successfulWrite
}

func (c *Channel) RequestSaveGroupCollection() bool {
	groupCollection := document.GetGroupCollection()
	projectName := c.GetCurrentSession().Project.Name

	fullProject := storage.GetDriver().ReadProjectDataByName(projectName)

	if fullProject.Id == "" {
		return false
	}

	var groupsToWrite []storageEntity.Group
	for _, g := range groupCollection.Groups {
		groupsToWrite = append(groupsToWrite, storageEntity.Group(g))
	}

	successfulWrite := storage.GetDriver().WriteGroupCollection(storageEntity.GroupCollection{
		Id:        groupCollection.Id,
		ProjectId: groupCollection.ProjectId,
		Groups:    groupsToWrite,
	}, projectName)

	return successfulWrite
}

func (c *Channel) RequestSaveProcessedTextCollection() bool {
	processedAreaCollection := document.GetProcessedAreaCollection()
	projectName := c.GetCurrentSession().Project.Name

	areasToWrite := make([]storageEntity.ProcessedArea, 0)
	for _, a := range processedAreaCollection.Areas {
		linesOfAreaToWrite := make([]storageEntity.ProcessedLine, 0)
		for _, l := range a.Lines {
			wordsOfLineToWrite := make([]storageEntity.ProcessedWord, 0)

			for _, w := range l.Words {
				symbolsOfWordToWrite := make([]storageEntity.ProcessedSymbol, 0)

				for _, s := range w.Symbols {
					symbolsOfWordToWrite = append(symbolsOfWordToWrite, storageEntity.ProcessedSymbol{
						Text:        s.Text,
						Confidence:  s.Confidence,
						BoundingBox: storageEntity.ProcessedBoundingBox(s.BoundingBox),
					})
				}

				wordsOfLineToWrite = append(wordsOfLineToWrite, storageEntity.ProcessedWord{
					Id:          w.Id,
					FullText:    w.FullText,
					Confidence:  w.Confidence,
					Direction:   w.Direction,
					BoundingBox: storageEntity.ProcessedBoundingBox(w.BoundingBox),
					Symbols:     symbolsOfWordToWrite,
				})
			}

			linesOfAreaToWrite = append(linesOfAreaToWrite, storageEntity.ProcessedLine{
				FullText: l.FullText,
				Words:    wordsOfLineToWrite,
			})
		}

		areasToWrite = append(areasToWrite, storageEntity.ProcessedArea{
			Id:         a.Id,
			DocumentId: a.DocumentId,
			FullText:   a.FullText,
			Order:      a.Order,
			Lines:      linesOfAreaToWrite,
		})
	}

	processedAreaCollectionToWrite := storageEntity.ProcessedTextCollection{
		Areas: areasToWrite,
	}

	successfulWrite := storage.GetDriver().WriteProcessedTextCollection(processedAreaCollectionToWrite, projectName)
	return successfulWrite
}

func (c *Channel) RequestSaveLocalUserProcessedMarkdownCollection() bool {
	userProcessedMarkdownCollection := document.GetUserMarkdownCollection()
	projectName := c.GetCurrentSession().Project.Name

	fullProject := storage.GetDriver().ReadProjectDataByName(projectName)

	if fullProject.Id == "" {
		return false
	}

	var valuesToWrite []storageEntity.ProcessedUserMarkdown
	for _, v := range userProcessedMarkdownCollection.Values {
		valuesToWrite = append(valuesToWrite, storageEntity.ProcessedUserMarkdown(v))
	}

	successfulWrite := storage.GetDriver().WriteProcessedUserMarkdownCollection(storageEntity.ProcessedUserMarkdownCollection{
		Values: valuesToWrite,
	}, projectName)

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
