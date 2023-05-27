package ipc

import (
	app "textualize/core/App"
	consts "textualize/core/Consts"
	document "textualize/core/Document"
	session "textualize/core/Session"
	"textualize/entities"
	storage "textualize/storage"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"github.com/google/uuid"
)

func (c *Channel) GetCurrentSession() entities.Session {
	currentSession := session.GetInstance()

	var sessionUsers []entities.User
	for _, u := range currentSession.Organization.Users {
		sessionUsers = append(sessionUsers, entities.User(u))
	}

	currentProject := currentSession.Project
	currentDefaultProcessLanguage := entities.Language(currentProject.Settings.DefaultProcessLanguage)
	currentDefaultTranslateTargetLanguage := entities.Language(currentProject.Settings.DefaultTranslateTargetLanguage)
	project := entities.Project{
		Id:             currentProject.Id,
		Name:           currentProject.Name,
		OrganizationId: currentProject.OrganizationId,
		Settings: entities.ProjectSettings{
			DefaultProcessLanguage:         currentDefaultProcessLanguage,
			DefaultTranslateTargetLanguage: currentDefaultTranslateTargetLanguage,
			IsHosted:                       currentProject.Settings.IsHosted,
		},
	}

	return entities.Session{
		Project: project,
		User:    currentSession.User,
		Organization: entities.Organization{
			Id:       currentSession.Organization.Id,
			Name:     currentSession.Project.Name,
			LogoPath: currentSession.Organization.LogoPath,
			Users:    sessionUsers,
		},
	}
}

func (c *Channel) CreateNewProject(name string) entities.Session {
	currentSession := session.GetInstance()

	newProject := entities.Project{
		Id:             uuid.NewString(),
		OrganizationId: currentSession.Project.OrganizationId,
		Name:           name,
	}

	successfulProjectWrite := storage.GetDriver().WriteProjectData(entities.Project{
		Id:             newProject.Id,
		OrganizationId: newProject.OrganizationId,
		Name:           newProject.Name,
	})

	if !successfulProjectWrite {
		return entities.Session{}
	}

	currentSession.Project = newProject

	return c.GetCurrentSession()
}

func (c *Channel) GetCurrentUser() entities.User {
	return session.GetInstance().User
}

func (c *Channel) RequestUpdateCurrentUser(updatedUserRequest entities.User) entities.User {
	sessionInstance := session.GetInstance()

	sessionUser := entities.User(sessionInstance.User)

	if sessionUser.LocalId == "" {
		sessionUser.LocalId = uuid.NewString()
	}
	if updatedUserRequest.FirstName != "" {
		sessionUser.FirstName = updatedUserRequest.FirstName
	}
	if updatedUserRequest.LastName != "" {
		sessionUser.LastName = updatedUserRequest.LastName
	}
	if updatedUserRequest.Email != "" {
		sessionUser.Email = updatedUserRequest.Email
	}

	sessionUser.AvatarPath = updatedUserRequest.AvatarPath

	successfulUserWrite := storage.GetDriver().WriteUserData(sessionUser)
	if !successfulUserWrite {
		return entities.User{}
	}

	sessionInstance.UpdateCurrentUser(sessionUser)

	return sessionInstance.User
}

func (c *Channel) RequestChooseUserAvatar() string {
	filePath, err := runtime.OpenFileDialog(app.GetInstance().Context, runtime.OpenDialogOptions{
		Title: "Select an Image",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Image Files (*.jpg, *.png)",
				Pattern:     "*.jpg;*.png",
			},
		},
	})

	if err != nil {
		runtime.LogError(app.GetInstance().Context, err.Error())
		return ""
	} else {
		return filePath
	}
}

func (c *Channel) GetAllLocalProjects() []entities.Project {
	readLocalProjects := storage.GetDriver().ReadAllProjects()
	return readLocalProjects
}

func (c *Channel) GetProjectByName(projectName string) entities.Project {
	foundProject := storage.GetDriver().ReadProjectDataByName(projectName)
	return foundProject
}

func (c *Channel) RequestChangeSessionProjectByName(projectName string) bool {
	storageDriver := storage.GetDriver()
	foundProject := c.GetProjectByName(projectName)

	if foundProject.Id == "" {
		return false
	}

	session.GetInstance().Project = foundProject

	localDocumentCollection := storageDriver.ReadDocumentCollection(projectName)
	documentCount := len(localDocumentCollection.Documents)
	readableDocuments := make([]document.Entity, documentCount)
	for i := 0; i < documentCount; i++ {
		readableDocuments[i] = document.Entity(localDocumentCollection.Documents[i])
	}
	document.SetDocumentCollection(document.DocumentCollection{
		Documents: readableDocuments,
		ProjectId: foundProject.Id,
	})

	localGroupsCollection := storageDriver.ReadGroupCollection(projectName)
	groupCount := len(localGroupsCollection.Groups)
	readableGroups := make([]entities.Group, groupCount)
	for i := 0; i < groupCount; i++ {
		readableGroups[i] = entities.Group(localGroupsCollection.Groups[i])
	}
	document.SetGroupCollection(document.GroupCollection{
		Id:        localGroupsCollection.Id,
		ProjectId: localGroupsCollection.ProjectId,
		Groups:    readableGroups,
	})

	// Processed Texts
	localProcessedAreaCollection := storageDriver.ReadProcessedTextCollection(projectName)
	areaCount := len(localProcessedAreaCollection.Areas)
	readableAreas := make([]entities.ProcessedArea, areaCount)
	for i := 0; i < areaCount; i++ {
		readableAreas[i] = entities.ProcessedArea(localProcessedAreaCollection.Areas[i])
	}
	document.SetProcessedAreaCollection(document.ProcessedAreaCollection{
		Areas: readableAreas,
	})

	// UserProcessedMarkdown
	localUserProcessedMarkdown := storageDriver.ReadProcessedUserMarkdownCollection(projectName)
	userProcessedMarkdownCount := len(localUserProcessedMarkdown.Values)
	readableUserProcessedMarkdown := make([]entities.UserMarkdown, userProcessedMarkdownCount)
	for i := 0; i < userProcessedMarkdownCount; i++ {
		readableUserProcessedMarkdown[i] = entities.UserMarkdown(localUserProcessedMarkdown.Values[i])
	}
	document.SetUserMarkdownCollection(document.UserMarkdownCollection{
		Values: readableUserProcessedMarkdown,
	})

	return session.GetInstance().Project.Id == foundProject.Id
}

func (c *Channel) GetSuppportedLanguages() []entities.Language {
	supportedLanguages := consts.GetSuppportedLanguages()
	return supportedLanguages
}
