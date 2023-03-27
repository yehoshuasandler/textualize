package ipc

import (
	app "textualize/core/App"
	consts "textualize/core/Consts"
	session "textualize/core/Session"
	storage "textualize/storage/Local"

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

	newProject := session.Project{
		Id:             uuid.NewString(),
		OrganizationId: currentSession.Project.OrganizationId,
		Name:           name,
	}

	successfulProjectWrite := storage.WriteLocalProjectData(storage.LocalProject{
		Id:             uuid.NewString(),
		OrganizationId: currentSession.Project.OrganizationId,
		Name:           name,
	})

	if !successfulProjectWrite {
		return Session{}
	}

	currentSession.Project = newProject

	return c.GetCurrentSession()
}

func (c *Channel) GetCurrentUser() User {
	return User(session.GetInstance().User)
}

func (c *Channel) RequestUpdateCurrentUser(updatedUserRequest User) User {
	sessionInstance := session.GetInstance()

	sessionUser := session.User(sessionInstance.User)

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

	successfulUserWrite := storage.WriteLocalUserData(storage.LocalUser(sessionUser))
	if !successfulUserWrite {
		return User{}
	}

	sessionInstance.UpdateCurrentUser(sessionUser)

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

func (c *Channel) GetAllLocalProjects() []Project {
	readLocalProjects := storage.ReadAllLocalProjects()
	response := make([]Project, 0)

	for _, p := range readLocalProjects {
		response = append(response, Project{
			Id:             p.Id,
			OrganizationId: p.OrganizationId,
			Name:           p.Name,
			Settings: ProjectSettings{
				DefaultProcessLanguage:         Language(p.Settings.DefaultProcessLanguage),
				DefaultTranslateTargetLanguage: Language(p.Settings.DefaultTranslateTargetLanguage),
				IsHosted:                       p.Settings.IsHosted,
			},
		})
	}

	return response
}

func (c *Channel) GetProjectByName(projectName string) Project {
	foundProject := storage.ReadLocalProjectByName(projectName)

	if foundProject.Id == "" {
		return Project{}
	}

	return Project{
		Id:             foundProject.Id,
		Name:           foundProject.Name,
		OrganizationId: foundProject.OrganizationId,
		Settings: ProjectSettings{
			DefaultProcessLanguage:         Language(foundProject.Settings.DefaultProcessLanguage),
			DefaultTranslateTargetLanguage: Language(foundProject.Settings.DefaultTranslateTargetLanguage),
			IsHosted:                       foundProject.Settings.IsHosted,
		},
	}
}

func (c *Channel) RequestChangeSessionProjectByName(projectName string) bool {
	foundProject := c.GetProjectByName(projectName)

	if foundProject.Id == "" {
		return false
	}

	session.GetInstance().Project = session.Project{
		Id:             foundProject.Id,
		Name:           foundProject.Name,
		OrganizationId: foundProject.OrganizationId,
		Settings: session.ProjectSettings{
			DefaultProcessLanguage:         consts.Language(foundProject.Settings.DefaultProcessLanguage),
			DefaultTranslateTargetLanguage: consts.Language(foundProject.Settings.DefaultTranslateTargetLanguage),
			IsHosted:                       foundProject.Settings.IsHosted,
		},
	}

	return session.GetInstance().Project.Id == foundProject.Id
}

func (c *Channel) GetSuppportedLanguages() []Language {
	supportedLanguages := consts.GetSuppportedLanguages()

	var response []Language

	for _, l := range supportedLanguages {
		response = append(response, Language(l))
	}

	return response
}
