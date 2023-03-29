package storage

import (
	entity "textualize/storage/Entities"
	local "textualize/storage/Local"
)

type Driver interface {
	WriteUserData(entity.User) bool
	ReadUserData() entity.User
	WriteProjectData(entity.Project) bool
	ReadProjectDataByName(string) entity.Project
	ReadAllProjects() []entity.Project
	WriteDocumentCollection(entity.DocumentCollection, string) bool
	ReadDocumentCollection(string) entity.DocumentCollection
	WriteGroupCollection(entity.GroupCollection, string) bool
	ReadGroupCollection(string) entity.GroupCollection
	WriteProcessedTextCollection(entity.ProcessedTextCollection, string) bool
	ReadProcessedTextCollection(string) entity.ProcessedTextCollection
	WriteProcessedUserMarkdownCollection(entity.ProcessedUserMarkdownCollection, string) bool
	ReadProcessedUserMarkdownCollection(string) entity.ProcessedUserMarkdownCollection
}

var driverInstance Driver

func GetDriver() Driver {
	if driverInstance == nil {
		driverInstance = local.LocalDriver{}
	}
	return driverInstance
}
