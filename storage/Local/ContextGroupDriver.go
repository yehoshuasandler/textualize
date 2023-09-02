package storage

import (
	"encoding/json"
	"textualize/entities"
)

func (d LocalDriver) WriteContextGroupCollection(serializedContextGroups []entities.SerializedLinkedProcessedArea, projectName string) bool {
	jsonData, _ := json.MarshalIndent(serializedContextGroups, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+projectName+"/", "ContextGroups.json")
	return writeError == nil
}

func (d LocalDriver) ReadContextGroupCollection(projectName string) []entities.SerializedLinkedProcessedArea {
	contextGroupCollectionData := make([]entities.SerializedLinkedProcessedArea, 0)
	readError := AssignFileDataToStruct("/projects/"+projectName+"/ContextGroups.json", &contextGroupCollectionData)
	if readError != nil {
		return make([]entities.SerializedLinkedProcessedArea, 0)
	}

	return contextGroupCollectionData
}
