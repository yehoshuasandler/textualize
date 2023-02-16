package ipc

import (
	app "textualize/core/App"
	document "textualize/core/Document"
	session "textualize/core/Session"

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
		jsonAreas = append(jsonAreas, Area(a))
	}
	response := Document{
		Id:        foundDocument.Id,
		Name:      foundDocument.Name,
		GroupId:   foundDocument.GroupId,
		Path:      foundDocument.Path,
		ProjectId: foundDocument.ProjectId,
		Areas:     jsonAreas,
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
			jsonAreas = append(jsonAreas, Area(a))
		}

		jsonDocument := Document{
			Id:        d.Id,
			GroupId:   d.GroupId,
			Name:      d.Name,
			Path:      d.Path,
			ProjectId: d.ProjectId,
			Areas:     jsonAreas,
		}
		response.Documents = append(response.Documents, jsonDocument)
	}

	for _, g := range groups {
		jsonGroup := Group{
			Id:        g.Id,
			ParentId:  g.ParentId,
			ProjectId: g.ProjectId,
			Name:      g.Name,
		}
		response.Groups = append(response.Groups, jsonGroup)
	}

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
	newGroup := document.Group{
		Id:        uuid.NewString(),
		Name:      name,
		ProjectId: session.GetInstance().Project.Id,
	}

	document.GetGroupCollection().AddDocumentGroup(newGroup)

	response := Group{
		Id:        newGroup.Id,
		Name:      newGroup.Name,
		ParentId:  newGroup.ParentId,
		ProjectId: newGroup.ProjectId,
	}

	return response
}

func (c *Channel) RequestAddArea(documentId string, area Area) Area {
	foundDocument := document.GetDocumentCollection().GetDocumentById(documentId)

	var id string
	if area.Id == "" {
		id = uuid.NewString()
	} else {
		id = area.Id
	}

	newArea := document.Area{
		Id:     id,
		Name:   area.Name,
		StartX: area.StartX,
		EndX:   area.EndX,
		StartY: area.StartY,
		EndY:   area.EndY,
	}
	foundDocument.AddArea(newArea)
	return Area(newArea)
}

func (c *Channel) RequestUpdateArea(updatedArea Area) Area {
	documentOfArea := document.GetDocumentCollection().GetDocumentByAreaId(updatedArea.Id)

	if documentOfArea.Id == "" {
		return Area{}
	}

	areaToUpdate := documentOfArea.GetAreaById((updatedArea.Id))

	if areaToUpdate.Id == "" {
		return Area{}
	}

	// TODO: add more prop changes when needed
	if updatedArea.Name != "" {
		areaToUpdate.Name = updatedArea.Name
	}

	return Area{
		Id:     updatedArea.Id,
		Name:   updatedArea.Name,
		StartX: updatedArea.StartX,
		StartY: updatedArea.StartY,
		EndX:   updatedArea.EndX,
		EndY:   updatedArea.EndY,
	}
}
