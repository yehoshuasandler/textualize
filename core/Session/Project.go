package session

import (
	app "textualize/core/App"
)

type Project struct {
	Id             string
	OrganizationId string
	Name           string
	Settings       ProjectSettings
}

type ProjectSettings struct {
	DefaultProcessLanguage         app.Language
	DefaultTranslateTargetLanguage app.Language
	IsHosted                       bool
}
