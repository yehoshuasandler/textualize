package storage

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
)

type LocalDriver struct{}

func getLocalStoragePath() string {
	homeDir, err := os.UserHomeDir()
	applicationName := "/Textualize"

	if err != nil {
		return ""
	}

	return homeDir + applicationName
}

// `relativeSubdirectoryPath` should start and end with a `/`.
//
// Use empty string if you wish to just use the Application directory
func createLocalStorageSubDirIfNeeded(relativeSubdirectoryPath string) bool {
	localStoragePath := getLocalStoragePath()
	if localStoragePath == "" {
		return false
	}

	fullLocalStoragePath := localStoragePath + relativeSubdirectoryPath

	_, directoryError := os.Stat(fullLocalStoragePath)
	directoryDoesNotExist := os.IsNotExist(directoryError)
	if !directoryDoesNotExist {
		return true
	}

	errorCreatingDir := os.MkdirAll(fullLocalStoragePath, os.ModePerm)
	return errorCreatingDir == nil
}

// `relativePathInAppDir` should both start and end with a `/`
//
// `fileName` should not start with a `/` to avoid bad pathing
func WriteDataToAppDir(data []byte, relativePathInAppDir string, fileName string) error {
	localStoragePath := getLocalStoragePath()

	if localStoragePath == "" {
		return errors.New("could not find application directory")
	}

	isLocalStorageDirectoryCreated := createLocalStorageSubDirIfNeeded(relativePathInAppDir)
	if !isLocalStorageDirectoryCreated {
		return errors.New("could not create subdirectory '" + localStoragePath + "' in application directory")
	}

	err := os.WriteFile(localStoragePath+relativePathInAppDir+fileName, data, 0644)
	return err
}

// `relativePathInAppDir` should both start with a `/` and end with the file name
func ReadDataFromAppDir(relativePathInAppDir string) ([]byte, error) {
	localStoragePath := getLocalStoragePath()

	if localStoragePath == "" {
		return make([]byte, 0), errors.New("could not find application directory")
	}

	data, err := os.ReadFile((localStoragePath + relativePathInAppDir))
	if err != nil {
		return make([]byte, 0), err
	}

	return data, nil
}

// `relativePathInAppDir` should both start with a `/` and end with the file name
func AssignFileDataToStruct(relativePathInAppDir string, structPointer interface{}) error {
	fileData, err := ReadDataFromAppDir(relativePathInAppDir)
	if err != nil {
		fmt.Println("ReadDataFromAppDir err: " + err.Error())
		return err
	}

	// response := structInterface
	errorUnmarshaling := json.Unmarshal([]byte(fileData), structPointer)
	if errorUnmarshaling != nil {
		fmt.Println("errorUnmarshaling err: " + errorUnmarshaling.Error())

		return errorUnmarshaling
	}

	return nil
}
