package storage

import (
	"encoding/json"
	entity "textualize/storage/Entities"
)

func (d LocalDriver) WriteProcessedTextCollection(collection entity.ProcessedTextCollection, projectName string) bool {
	jsonData, _ := json.MarshalIndent(collection, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+projectName+"/", "ProcessedTexts.json")
	return writeError == nil
}

func (d LocalDriver) ReadProcessedTextCollection(projectName string) entity.ProcessedTextCollection {
	collectionData := entity.ProcessedTextCollection{}
	readError := AssignFileDataToStruct("/projects/"+projectName+"/ProcessedTexts.json", &collectionData)
	if readError != nil {
		return entity.ProcessedTextCollection{}
	}

	return collectionData
}

func (d LocalDriver) WriteProcessedUserMarkdownCollection(collection entity.ProcessedUserMarkdownCollection, projectName string) bool {
	jsonData, _ := json.MarshalIndent(collection, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+projectName+"/", "UserProcessedMarkdown.json")
	return writeError == nil
}

func (d LocalDriver) ReadProcessedUserMarkdownCollection(projectName string) entity.ProcessedUserMarkdownCollection {
	collectionData := entity.ProcessedUserMarkdownCollection{}
	readError := AssignFileDataToStruct("/projects/"+projectName+"/UserProcessedMarkdown.json", &collectionData)
	if readError != nil {
		return entity.ProcessedUserMarkdownCollection{}
	}

	return collectionData
}
