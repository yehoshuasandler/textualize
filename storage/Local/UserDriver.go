package storage

import (
	"encoding/json"
	storage "textualize/storage/Entities"
)

func (d LocalDriver) WriteUserData(user storage.User) bool {
	jsonData, _ := json.MarshalIndent(user, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/", "User.json")
	return writeError == nil
}

func (d LocalDriver) ReadUserData() storage.User {
	userData := storage.User{}
	readError := AssignFileDataToStruct("/User.json", &userData)
	if readError != nil {
		return storage.User{}
	}

	return userData
}
