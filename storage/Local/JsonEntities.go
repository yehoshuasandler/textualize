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

type LocalDocument struct {
	Id              string      `json:"id"`
	GroupId         string      `json:"groupId"`
	Name            string      `json:"name"`
	Path            string      `json:"path"`
	ProjectId       string      `json:"projectId"`
	Areas           []LocalArea `json:"areas"`
	DefaultLanguage Language    `json:"defaultLanguage"`
}

type LocalDocumentCollection struct {
	Documents []LocalDocument `json:"documents"`
	ProjectId string          `json:"projectId"`
}

type LocalArea struct {
	Id       string   `json:"id"`
	Name     string   `json:"name"`
	StartX   int      `json:"startX"`
	StartY   int      `json:"startY"`
	EndX     int      `json:"endX"`
	EndY     int      `json:"endY"`
	Language Language `json:"language"`
	Order    int      `json:"order"`
}

type LocalGroup struct {
	Id        string `json:"id"`
	ParentId  string `json:"parentId"`
	ProjectId string `json:"projectId"`
	Name      string `json:"name"`
	Order     int    `json:"order"`
}

type LocalGroupCollection struct {
	Id        string       `json:"id"`
	Groups    []LocalGroup `json:"groups"`
	ProjectId string       `json:"projectId"`
}