package ipc

import (
	document "textualize/core/Document"
)

type GetDocumentsResponse struct {
	Documents      []Document      `json:"documents"`
	DocumentGroups []DocumentGroup `json:"documentGroups"`
}

func (c *Channel) GetDocuments() GetDocumentsResponse {
	documents := document.GetDocumentCollection().Documents
	documentGroups := document.GetDocumentGroupCollection().DocumentGroups

	var response GetDocumentsResponse

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
