package storage

type Project struct {
	Id             string          `json:"id"`
	OrganizationId string          `json:"organizationId"`
	Name           string          `json:"name"`
	Settings       ProjectSettings `json:"settings"`
}

type ProjectSettings struct {
	DefaultProcessLanguage         Language `json:"defaultProcessLanguage"`
	DefaultTranslateTargetLanguage Language `json:"defaultTranslateTargetLanguage"`
	IsHosted                       bool     `json:"isHosted"`
}
