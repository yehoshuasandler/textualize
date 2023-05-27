package storage

import (
	"textualize/entities"
	local "textualize/storage/Local"
)

type Driver interface {
	WriteUserData(entities.User) bool
	ReadUserData() entities.User
	WriteProjectData(entities.Project) bool
	ReadProjectDataByName(string) entities.Project
	ReadAllProjects() []entities.Project
	WriteDocumentCollection(entities.DocumentCollection, string) bool
	ReadDocumentCollection(string) entities.DocumentCollection
	WriteGroupCollection(entities.GroupCollection, string) bool
	ReadGroupCollection(string) entities.GroupCollection
	WriteProcessedTextCollection(entities.ProcessedTextCollection, string) bool
	ReadProcessedTextCollection(string) entities.ProcessedTextCollection
	WriteProcessedUserMarkdownCollection(entities.ProcessedUserMarkdownCollection, string) bool
	ReadProcessedUserMarkdownCollection(string) entities.ProcessedUserMarkdownCollection
}

var driverInstance Driver

func GetDriver() Driver {
	if driverInstance == nil {
		driverInstance = local.LocalDriver{}
	}
	return driverInstance
}
