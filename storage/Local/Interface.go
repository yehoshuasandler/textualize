package storage

import (
	"encoding/json"
	"fmt"
	"os"
)

func GetLocalStoragePath() string {
	homeDir, err := os.UserHomeDir()
	applicationName := "/Textualize"

	if err != nil {
		return ""
	}

	return homeDir + applicationName
}

func createLocalStorageDirIfNeeded() bool {
	localStoragePath := GetLocalStoragePath()
	if localStoragePath == "" {
		return false
	}

	_, directoryError := os.Stat(GetLocalStoragePath())
	directoryDoesNotExist := os.IsNotExist(directoryError)
	if !directoryDoesNotExist {
		return true
	}

	errorCreatingDir := os.Mkdir(localStoragePath, os.ModePerm)
	return errorCreatingDir != nil
}

func createLocalStorageSubDirIfNeeded(relativeSubdirectoryPath string) bool {
	localStoragePath := GetLocalStoragePath()
	if localStoragePath == "" {
		return false
	}

	fullLocalStoragePath := GetLocalStoragePath() + relativeSubdirectoryPath

	_, directoryError := os.Stat(fullLocalStoragePath)
	directoryDoesNotExist := os.IsNotExist(directoryError)
	if !directoryDoesNotExist {
		return true
	}

	errorCreatingDir := os.MkdirAll(fullLocalStoragePath, os.ModePerm)
	return errorCreatingDir != nil
}

func WriteLocalUserData(user LocalUser) bool {
	file, _ := json.MarshalIndent(user, "", " ")
	path := GetLocalStoragePath()

	if path == "" {
		return false
	}

	isLocalStorageDirectoryCreated := createLocalStorageDirIfNeeded()
	if !isLocalStorageDirectoryCreated {
		return false
	}

	err := os.WriteFile(GetLocalStoragePath()+"/User.json", file, 0644)

	return err == nil
}

func ReadLocalUserData() LocalUser {

	file, err := os.ReadFile(GetLocalStoragePath() + "/User.json")

	if err != nil {
		return LocalUser{}
	}

	response := LocalUser{}
	errorUnmarshaling := json.Unmarshal([]byte(file), &response)
	if errorUnmarshaling != nil {
		return LocalUser{}
	}

	return response
}

func ReadLocalProjectByName(name string) LocalProject {
	file, err := os.ReadFile(GetLocalStoragePath() + "/projects/" + name + "/Project.json")

	if err != nil {
		return LocalProject{}
	}

	response := LocalProject{}
	errorUnmarshaling := json.Unmarshal([]byte(file), &response)
	if errorUnmarshaling != nil {
		return LocalProject{}
	}

	return response
}

func WriteLocalProjectData(project LocalProject) bool {
	file, _ := json.MarshalIndent(project, "", " ")
	path := GetLocalStoragePath()

	if path == "" {
		return false
	}

	subdirectory := "/projects/" + project.Name + "/"
	isLocalStorageDirectoryCreated := createLocalStorageSubDirIfNeeded(subdirectory)
	if !isLocalStorageDirectoryCreated {
		return false
	}

	err := os.WriteFile(GetLocalStoragePath()+subdirectory+project.Name+"/Project.json", file, 0644)

	return err == nil
}

func ReadAllLocalProjects() []LocalProject {
	localProjects := make([]LocalProject, 0)

	subdirectory := "/projects/"
	isLocalStorageDirectoryCreated := createLocalStorageSubDirIfNeeded(subdirectory)
	if !isLocalStorageDirectoryCreated {
		return localProjects
	}

	localProjectFileEntries, readDirError := os.ReadDir(GetLocalStoragePath() + subdirectory)
	if readDirError != nil {
		fmt.Println(localProjectFileEntries)
		return localProjects
	}

	localProjectNames := make([]string, 0)
	for _, fileEntry := range localProjectFileEntries {
		localProjectNames = append(localProjectNames, fileEntry.Name())
		// localProjectNames = append(localProjectNames, strings.ReplaceAll(fileName.Name(), ".json", ""))
	}

	for _, projectName := range localProjectNames {
		localProjects = append(localProjects, ReadLocalProjectByName(projectName))
	}

	return localProjects
}

func WriteLocalDocumentCollection(documentCollection LocalDocumentCollection, projectName string) bool {
	file, _ := json.MarshalIndent(documentCollection, "", " ")
	path := GetLocalStoragePath()

	if path == "" {
		return false
	}

	subdirectory := "/projects/" + projectName
	isLocalStorageDirectoryCreated := createLocalStorageSubDirIfNeeded(subdirectory)
	if !isLocalStorageDirectoryCreated {
		return false
	}

	err := os.WriteFile(GetLocalStoragePath()+subdirectory+"/Documents.json", file, 0644)

	return err == nil
}

func ReadLocalDocumentCollection(projectName string) LocalDocumentCollection {
	file, err := os.ReadFile(GetLocalStoragePath() + "/projects/" + projectName + "/Documents.json")

	if err != nil {
		return LocalDocumentCollection{}
	}

	response := LocalDocumentCollection{}
	errorUnmarshaling := json.Unmarshal([]byte(file), &response)
	if errorUnmarshaling != nil {
		return LocalDocumentCollection{}
	}

	return response
}

func WriteLocalGroupCollection(groupCollection LocalGroupCollection, projectName string) bool {
	file, _ := json.MarshalIndent(groupCollection, "", " ")
	path := GetLocalStoragePath()

	if path == "" {
		return false
	}

	subdirectory := "/projects/" + projectName
	isLocalStorageDirectoryCreated := createLocalStorageSubDirIfNeeded(subdirectory)
	if !isLocalStorageDirectoryCreated {
		return false
	}

	err := os.WriteFile(GetLocalStoragePath()+subdirectory+"/Groups.json", file, 0644)

	return err == nil
}

func ReadLocalGroupCollection(projectName string) LocalGroupCollection {
	file, err := os.ReadFile(GetLocalStoragePath() + "/projects/" + projectName + "/Groups.json")

	if err != nil {
		return LocalGroupCollection{}
	}

	response := LocalGroupCollection{}
	errorUnmarshaling := json.Unmarshal([]byte(file), &response)
	if errorUnmarshaling != nil {
		return LocalGroupCollection{}
	}

	return response
}
