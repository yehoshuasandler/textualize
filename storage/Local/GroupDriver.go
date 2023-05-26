package storage

import (
	"encoding/json"
	"textualize/entities"
)

func (d LocalDriver) WriteGroupCollection(collection entities.GroupCollection, projectName string) bool {
	jsonData, _ := json.MarshalIndent(collection, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+projectName+"/", "Groups.json")
	return writeError == nil
}

func (d LocalDriver) ReadGroupCollection(projectName string) entities.GroupCollection {
	collectionData := entities.GroupCollection{}
	readError := AssignFileDataToStruct("/projects/"+projectName+"/Groups.json", &collectionData)
	if readError != nil {
		return entities.GroupCollection{}
	}

	return collectionData
}
