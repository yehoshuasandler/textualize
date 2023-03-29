package ipc

import (
	app "textualize/core/App"
	consts "textualize/core/Consts"
	document "textualize/core/Document"
	session "textualize/core/Session"
	storage "textualize/storage"
	storageEntity "textualize/storage/Entities"

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

	successfulProjectWrite := storage.GetDriver().WriteProjectData(storageEntity.Project{
		Id:             newProject.Id,
		OrganizationId: newProject.OrganizationId,
		Name:           newProject.Name,
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

	successfulUserWrite := storage.GetDriver().WriteUserData(storageEntity.User(sessionUser))
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
	readLocalProjects := storage.GetDriver().ReadAllProjects()
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
	foundProject := storage.GetDriver().ReadProjectDataByName(projectName)

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
	storageDriver := storage.GetDriver()
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

	localDocumentCollection := storageDriver.ReadDocumentCollection(projectName)
	newDocuments := make([]document.Entity, 0)
	for _, d := range localDocumentCollection.Documents {
		newAreas := make([]document.Area, 0)
		for _, a := range d.Areas {
			newAreas = append(newAreas, document.Area{
				Id:       a.Id,
				Name:     a.Name,
				StartX:   a.StartX,
				StartY:   a.StartY,
				EndX:     a.EndX,
				EndY:     a.EndY,
				Language: consts.Language(a.Language),
				Order:    a.Order,
			})
		}
		newDocuments = append(newDocuments, document.Entity{
			Id:              d.Id,
			GroupId:         d.GroupId,
			Name:            d.Name,
			Path:            d.Path,
			ProjectId:       d.ProjectId,
			Areas:           newAreas,
			DefaultLanguage: consts.Language(d.DefaultLanguage),
		})
	}
	newDocumentColllection := document.DocumentCollection{
		Documents: newDocuments,
		ProjectId: foundProject.Id,
	}
	document.SetDocumentCollection(newDocumentColllection)

	localGroupsCollection := storageDriver.ReadGroupCollection(projectName)
	newGroups := make([]document.Group, 0)
	for _, g := range localGroupsCollection.Groups {
		newGroups = append(newGroups, document.Group(g))
	}
	newGroupCollection := document.GroupCollection{
		Id:        localGroupsCollection.Id,
		ProjectId: localGroupsCollection.ProjectId,
		Groups:    newGroups,
	}
	document.SetGroupCollection(newGroupCollection)

	// Processed Texts

	localProcessedAreaCollection := storageDriver.ReadProcessedTextCollection(projectName)
	newAreas := make([]document.ProcessedArea, 0)
	for _, a := range localProcessedAreaCollection.Areas {
		linesOfArea := make([]document.ProcessedLine, 0)
		for _, l := range a.Lines {
			wordsOfLine := make([]document.ProcessedWord, 0)

			for _, w := range l.Words {
				symbolsOfWord := make([]document.ProcessedSymbol, 0)

				for _, s := range w.Symbols {
					symbolsOfWord = append(symbolsOfWord, document.ProcessedSymbol{
						Text:        s.Text,
						Confidence:  s.Confidence,
						BoundingBox: document.ProcessedBoundingBox(s.BoundingBox),
					})
				}

				wordsOfLine = append(wordsOfLine, document.ProcessedWord{
					FullText:    w.FullText,
					Confidence:  w.Confidence,
					Direction:   w.Direction,
					BoundingBox: document.ProcessedBoundingBox(w.BoundingBox),
					Symbols:     symbolsOfWord,
				})
			}

			linesOfArea = append(linesOfArea, document.ProcessedLine{
				FullText: l.FullText,
				Words:    wordsOfLine,
			})
		}

		newAreas = append(newAreas, document.ProcessedArea{
			Id:         a.Id,
			DocumentId: a.DocumentId,
			FullText:   a.FullText,
			Order:      a.Order,
			Lines:      linesOfArea,
		})
	}

	document.SetProcessedAreaCollection(document.ProcessedAreaCollection{
		Areas: newAreas,
	})

	// UserProcessedMarkdown

	localUserProcessedMarkdown := storageDriver.ReadProcessedUserMarkdownCollection(projectName)

	newUserProcessedMarkdown := make([]document.UserMarkdown, 0)
	for _, v := range localUserProcessedMarkdown.Values {
		newUserProcessedMarkdown = append(newUserProcessedMarkdown, document.UserMarkdown{
			Id:         v.Id,
			DocumentId: v.DocumentId,
			Value:      v.Value,
		})
	}

	document.SetUserMarkdownCollection(document.UserMarkdownCollection{
		Values: newUserProcessedMarkdown,
	})

	// End UserProcessedMarkdown

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
