package storage

type LocalProject struct {
	Id             string               `json:"id"`
	OrganizationId string               `json:"organizationId"`
	Name           string               `json:"name"`
	Settings       LocalProjectSettings `json:"settings"`
}

type LocalProjectSettings struct {
	DefaultProcessLanguage         Language `json:"defaultProcessLanguage"`
	DefaultTranslateTargetLanguage Language `json:"defaultTranslateTargetLanguage"`
	IsHosted                       bool     `json:"isHosted"`
}

type Language struct {
	DisplayName   string `json:"displayName"`
	ProcessCode   string `json:"processCode"`
	TranslateCode string `json:"translateCode"`
}

type LocalUser struct {
	Id         string `json:"id"`
	LocalId    string `json:"localId"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	AvatarPath string `json:"avatarPath"`
	AuthToken  string `json:"authToken"`
	Email      string `json:"email"`
}
