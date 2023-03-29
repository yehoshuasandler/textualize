package storage

import (
	"encoding/json"
	entity "textualize/storage/Entities"
)

func (d LocalDriver) WriteDocumentCollection(documentCollection entity.DocumentCollection, projectName string) bool {
	jsonData, _ := json.MarshalIndent(documentCollection, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+projectName+"/", "Documents.json")
	return writeError == nil
}

func (d LocalDriver) ReadDocumentCollection(projectName string) entity.DocumentCollection {
	documentCollectionData := entity.DocumentCollection{}
	readError := AssignFileDataToStruct("/projects/"+projectName+"/Documents.json", &documentCollectionData)
	if readError != nil {
		return entity.DocumentCollection{}
	}

	return documentCollectionData
}
