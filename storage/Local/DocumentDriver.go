package storage

import (
	"encoding/json"
	"textualize/entities"
)

func (d LocalDriver) WriteDocumentCollection(documentCollection entities.DocumentCollection, projectName string) bool {
	jsonData, _ := json.MarshalIndent(documentCollection, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+projectName+"/", "Documents.json")
	return writeError == nil
}

func (d LocalDriver) ReadDocumentCollection(projectName string) entities.DocumentCollection {
	documentCollectionData := entities.DocumentCollection{}
	readError := AssignFileDataToStruct("/projects/"+projectName+"/Documents.json", &documentCollectionData)
	if readError != nil {
		return entities.DocumentCollection{}
	}

	return documentCollectionData
}
