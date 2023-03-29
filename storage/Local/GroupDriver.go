package storage

import (
	"encoding/json"
	entity "textualize/storage/Entities"
)

func (d LocalDriver) WriteGroupCollection(collection entity.GroupCollection, projectName string) bool {
	jsonData, _ := json.MarshalIndent(collection, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+projectName+"/", "Groups.json")
	return writeError == nil
}

func (d LocalDriver) ReadGroupCollection(projectName string) entity.GroupCollection {
	collectionData := entity.GroupCollection{}
	readError := AssignFileDataToStruct("/projects/"+projectName+"/Groups.json", &collectionData)
	if readError != nil {
		return entity.GroupCollection{}
	}

	return collectionData
}
