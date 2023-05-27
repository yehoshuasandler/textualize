package storage

import (
	"encoding/json"
	"textualize/entities"
)

func (d LocalDriver) WriteUserData(user entities.User) bool {
	jsonData, _ := json.MarshalIndent(user, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/", "User.json")
	return writeError == nil
}

func (d LocalDriver) ReadUserData() entities.User {
	userData := entities.User{}
	readError := AssignFileDataToStruct("/User.json", &userData)
	if readError != nil {
		return entities.User{}
	}

	return userData
}
