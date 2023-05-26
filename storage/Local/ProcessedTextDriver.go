package storage

import (
	"encoding/json"
	"textualize/entities"
)

func (d LocalDriver) WriteProcessedTextCollection(collection entities.ProcessedTextCollection, projectName string) bool {
	jsonData, _ := json.MarshalIndent(collection, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+projectName+"/", "ProcessedTexts.json")
	return writeError == nil
}

func (d LocalDriver) ReadProcessedTextCollection(projectName string) entities.ProcessedTextCollection {
	collectionData := entities.ProcessedTextCollection{}
	readError := AssignFileDataToStruct("/projects/"+projectName+"/ProcessedTexts.json", &collectionData)
	if readError != nil {
		return entities.ProcessedTextCollection{}
	}

	return collectionData
}

func (d LocalDriver) WriteProcessedUserMarkdownCollection(collection entities.ProcessedUserMarkdownCollection, projectName string) bool {
	jsonData, _ := json.MarshalIndent(collection, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+projectName+"/", "UserProcessedMarkdown.json")
	return writeError == nil
}

func (d LocalDriver) ReadProcessedUserMarkdownCollection(projectName string) entities.ProcessedUserMarkdownCollection {
	collectionData := entities.ProcessedUserMarkdownCollection{}
	readError := AssignFileDataToStruct("/projects/"+projectName+"/UserProcessedMarkdown.json", &collectionData)
	if readError != nil {
		return entities.ProcessedUserMarkdownCollection{}
	}

	return collectionData
}
