package ipc

type Document struct {
	Id              string   `json:"id"`
	GroupId         string   `json:"groupId"`
	Name            string   `json:"name"`
	Path            string   `json:"path"`
	ProjectId       string   `json:"projectId"`
	Areas           []Area   `json:"areas"`
	DefaultLanguage Language `json:"defaultLanguage"`
}

type DocumentCollection struct {
	Documents []Document `json:"documents"`
	ProjectId string     `json:"projectId"`
}

type Group struct {
	Id        string `json:"id"`
	ParentId  string `json:"parentId"`
	ProjectId string `json:"projectId"`
	Name      string `json:"name"`
	Order     int    `json:"order"`
}

type GroupCollection struct {
	Id        string  `json:"id"`
	Groups    []Group `json:"groups"`
	ProjectId string  `json:"projectId"`
}

type Area struct {
	Id       string   `json:"id"`
	Name     string   `json:"name"`
	StartX   int      `json:"startX"`
	StartY   int      `json:"startY"`
	EndX     int      `json:"endX"`
	EndY     int      `json:"endY"`
	Language Language `json:"language"`
	Order    int      `json:"order"`
}

type ProcessedBoundingBox struct {
	X0 int32 `json:"x0"`
	Y0 int32 `json:"y0"`
	X1 int32 `json:"x1"`
	Y1 int32 `json:"y1"`
}

type ProcessedSymbol struct {
	Text        string               `json:"text"`
	Confidence  float32              `json:"confidence"`
	BoundingBox ProcessedBoundingBox `json:"boundingBox"`
}

type ProcessedWord struct {
	FullText    string               `json:"fullText"`
	Symbols     []ProcessedSymbol    `json:"symbols"`
	Confidence  float32              `json:"confidence"`
	Direction   string               `json:"direction"`
	BoundingBox ProcessedBoundingBox `json:"boundingBox"`
}

type ProcessedLine struct {
	FullText string          `json:"fullText"`
	Words    []ProcessedWord `json:"words"`
}

type ProcessedArea struct {
	Id         string          `json:"id"`
	DocumentId string          `json:"documentId"`
	FullText   string          `json:"fullText"`
	Order      int             `json:"order"`
	Lines      []ProcessedLine `json:"lines"`
}

type UserMarkdown struct {
	Id         string `json:"id"`
	DocumentId string `json:"documentId"`
	Value      string `json:"value"`
}

type UserMarkdownCollection struct {
	Values []UserMarkdown `json:"values"`
}

type User struct {
	Id         string `json:"id"`
	LocalId    string `json:"localId"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	AvatarPath string `json:"avatarPath"`
	AuthToken  string `json:"authToken"`
	Email      string `json:"email"`
}

type Organization struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	LogoPath string `json:"logoPath"`
	Users    []User `json:"users"`
}

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

type Session struct {
	Project      Project      `json:"project"`
	Organization Organization `json:"organization"`
	User         User         `json:"user"`
}

type Language struct {
	DisplayName   string `json:"displayName"`
	ProcessCode   string `json:"processCode"`
	TranslateCode string `json:"translateCode"`
}
