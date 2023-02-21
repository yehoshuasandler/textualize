package ipc

import (
	app "textualize/core/App"
	session "textualize/core/Session"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"github.com/google/uuid"
)

func (c *Channel) GetCurrentSession() Session {
	currentSession := session.GetInstance()

	var sessionUsers []User
	for _, u := range currentSession.Organization.Users {
		sessionUsers = append(sessionUsers, User(u))
	}

	currentProject := currentSession.Project
	currentDefaultProcessLanguage := Language(currentProject.Settings.DefaultProcessLanguage)
	currentDefaultTranslateTargetLanguage := Language(currentProject.Settings.DefaultTranslateTargetLanguage)
	project := Project{
		Id:             currentProject.Id,
		Name:           currentProject.Name,
		OrganizationId: currentProject.OrganizationId,
		Settings: ProjectSettings{
			DefaultProcessLanguage:         currentDefaultProcessLanguage,
			DefaultTranslateTargetLanguage: currentDefaultTranslateTargetLanguage,
			IsHosted:                       currentProject.Settings.IsHosted,
		},
	}

	return Session{
		Project: Project(project),
		User:    User(currentSession.User),
		Organization: Organization{
			Id:       currentSession.Organization.Id,
			Name:     currentSession.Project.Name,
			LogoPath: currentSession.Organization.LogoPath,
			Users:    sessionUsers,
		},
	}
}

func (c *Channel) CreateNewProject(name string) Session {
	currentSession := session.GetInstance()

	currentSession.Project = session.Project{
		Id:             uuid.NewString(),
		OrganizationId: currentSession.Project.OrganizationId,
		Name:           name,
	}

	return c.GetCurrentSession()
}

func (c *Channel) GetCurrentUser() User {
	return User(session.GetInstance().User)
}

func (c *Channel) RequestUpdateCurrentUser(updatedUserRequest User) User {
	sessionInstance := session.GetInstance()

	user := session.User(sessionInstance.User)

	if user.LocalId == "" {
		user.LocalId = uuid.NewString()
	}
	if updatedUserRequest.FirstName != "" {
		user.FirstName = updatedUserRequest.FirstName
	}
	if updatedUserRequest.LastName != "" {
		user.LastName = updatedUserRequest.LastName
	}
	if updatedUserRequest.Email != "" {
		user.Email = updatedUserRequest.Email
	}

	user.AvatarPath = updatedUserRequest.AvatarPath

	sessionInstance.UpdateCurrentUser(user)
	return User(sessionInstance.User)
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

func (c *Channel) GetSuppportedLanguages() []Language {
	supportedLanguages := app.GetSuppportedLanguages()

	var response []Language

	for _, l := range supportedLanguages {
		response = append(response, Language(l))
	}

	return response
}
