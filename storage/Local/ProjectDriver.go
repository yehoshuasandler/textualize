package storage

import (
	"encoding/json"
	"os"
	storage "textualize/storage/Entities"
)

func (d LocalDriver) WriteProjectData(project storage.Project) bool {
	jsonData, _ := json.MarshalIndent(project, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+project.Name+"/", "Project.json")
	return writeError == nil
}

func (d LocalDriver) ReadProjectDataByName(projectName string) storage.Project {
	projectData := storage.Project{}
	readError := AssignFileDataToStruct("/projects/"+projectName+"/Project.json", &projectData)
	if readError != nil {
		return storage.Project{}
	}

	return projectData
}

func (d LocalDriver) ReadAllProjects() []storage.Project {
	localProjects := make([]storage.Project, 0)

	subdirectory := "/projects/"
	isLocalStorageDirectoryCreated := createLocalStorageSubDirIfNeeded(subdirectory)
	if !isLocalStorageDirectoryCreated {
		return localProjects
	}

	localProjectDirEntries, readDirError := os.ReadDir(getLocalStoragePath() + subdirectory)
	if readDirError != nil {
		return localProjects
	}

	localProjectDirNames := make([]string, 0)
	for _, fileEntry := range localProjectDirEntries {
		localProjectDirNames = append(localProjectDirNames, fileEntry.Name())
	}

	for _, projectName := range localProjectDirNames {
		localProjects = append(localProjects, d.ReadProjectDataByName(projectName))
	}

	return localProjects
}
