package storage

import (
	"encoding/json"
	"os"
	"textualize/entities"
)

func (d LocalDriver) WriteProjectData(project entities.Project) bool {
	jsonData, _ := json.MarshalIndent(project, "", " ")
	writeError := WriteDataToAppDir(jsonData, "/projects/"+project.Name+"/", "Project.json")
	return writeError == nil
}

func (d LocalDriver) ReadProjectDataByName(projectName string) entities.Project {
	projectData := entities.Project{}
	readError := AssignFileDataToStruct("/projects/"+projectName+"/Project.json", &projectData)
	if readError != nil {
		return entities.Project{}
	}

	return projectData
}

func (d LocalDriver) ReadAllProjects() []entities.Project {
	localProjects := make([]entities.Project, 0)

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
