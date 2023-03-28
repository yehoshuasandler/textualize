package storage

import (
	"encoding/json"
	"os"
)

func WriteLocalProcessedAreaCollection(processedTextCollection LocalProcessedAreaCollection, projectName string) bool {
	file, _ := json.MarshalIndent(processedTextCollection, "", " ")
	path := GetLocalStoragePath()

	if path == "" {
		return false
	}

	subdirectory := "/projects/" + projectName
	isLocalStorageDirectoryCreated := createLocalStorageSubDirIfNeeded(subdirectory)
	if !isLocalStorageDirectoryCreated {
		return false
	}

	err := os.WriteFile(GetLocalStoragePath()+subdirectory+"/ProcessedTexts.json", file, 0644)

	return err == nil
}

func ReadLocalProcessedAreaCollection(projectName string) LocalProcessedAreaCollection {
	file, err := os.ReadFile(GetLocalStoragePath() + "/projects/" + projectName + "/ProcessedTexts.json")

	if err != nil {
		return LocalProcessedAreaCollection{}
	}

	response := LocalProcessedAreaCollection{}
	errorUnmarshaling := json.Unmarshal([]byte(file), &response)
	if errorUnmarshaling != nil {
		return LocalProcessedAreaCollection{}
	}

	return response
}

func WriteLocalUserProcessedMarkdownCollection(userMarkdownCollection LocalUserMarkdownCollection, projectName string) bool {
	file, _ := json.MarshalIndent(userMarkdownCollection, "", " ")
	path := GetLocalStoragePath()

	if path == "" {
		return false
	}

	subdirectory := "/projects/" + projectName
	isLocalStorageDirectoryCreated := createLocalStorageSubDirIfNeeded(subdirectory)
	if !isLocalStorageDirectoryCreated {
		return false
	}

	err := os.WriteFile(GetLocalStoragePath()+subdirectory+"/UserProcessedMarkdown.json", file, 0644)

	return err == nil
}

func ReadLocalUserProcessedMarkdownCollection(projectName string) LocalUserMarkdownCollection {
	file, err := os.ReadFile(GetLocalStoragePath() + "/projects/" + projectName + "/UserProcessedMarkdown.json")

	if err != nil {
		return LocalUserMarkdownCollection{}
	}

	response := LocalUserMarkdownCollection{}
	errorUnmarshaling := json.Unmarshal([]byte(file), &response)
	if errorUnmarshaling != nil {
		return LocalUserMarkdownCollection{}
	}

	return response
}
