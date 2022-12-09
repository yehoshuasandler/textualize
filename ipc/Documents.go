package ipc

import (
	app "textualize/core/App"
	document "textualize/core/Document"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type GetDocumentsResponse struct {
	Documents      []Document      `json:"documents"`
	DocumentGroups []DocumentGroup `json:"documentGroups"`
}

func (c *Channel) GetDocuments() GetDocumentsResponse {
	documents := document.GetDocumentCollection().Documents
	documentGroups := document.GetDocumentGroupCollection().DocumentGroups

	response := GetDocumentsResponse{
		DocumentGroups: make([]DocumentGroup, 0),
		Documents:      make([]Document, 0),
	}

	for _, d := range documents {
		jsonDocument := Document{
			Id:        d.Id,
			GroupId:   d.GroupId,
			Name:      d.Name,
			Path:      d.Path,
			ProjectId: d.ProjectId,
		}
		response.Documents = append(response.Documents, jsonDocument)
	}

	for _, g := range documentGroups {
		jsonGroup := DocumentGroup{
			Id:        g.Id,
			ParentId:  g.ParentId,
			ProjectId: g.ProjectId,
			Name:      g.Name,
		}
		response.DocumentGroups = append(response.DocumentGroups, jsonGroup)
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

	newDocument := document.Document{
		Id:        uuid.NewString(),
		Name:      documentName,
		Path:      filePath,
		GroupId:   groupId,
		ProjectId: "something else",
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

func (c *Channel) RequestAddDocumentGroup(name string) DocumentGroup {
	newDocumentGroup := document.DocumentGroup{
		Id:        uuid.NewString(),
		Name:      name,
		ProjectId: "something else",
	}

	document.GetDocumentGroupCollection().AddDocumentGroup(newDocumentGroup)

	response := DocumentGroup{
		Id:        newDocumentGroup.Id,
		Name:      newDocumentGroup.Name,
		ParentId:  newDocumentGroup.ParentId,
		ProjectId: newDocumentGroup.ProjectId,
	}

	return response
}
