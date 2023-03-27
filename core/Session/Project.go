package session

import (
	consts "textualize/core/Consts"
)

type Project struct {
	Id             string
	OrganizationId string
	Name           string
	Settings       ProjectSettings
}

type ProjectSettings struct {
	DefaultProcessLanguage         consts.Language
	DefaultTranslateTargetLanguage consts.Language
	IsHosted                       bool
}
