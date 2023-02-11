package ipc

type Document struct {
	Id               string `json:"id"`
	GroupId          string `json:"groupId"`
	Name             string `json:"name"`
	Path             string `json:"path"`
	ProjectId        string `json:"projectId"`
	Areas            []Area `json:"areas"`
	ModifiedMarkdown string `json:"modifiedMarkdown"`
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
}

type GroupCollection struct {
	Id        string  `json:"id"`
	Groups    []Group `json:"groups"`
	ProjectId string  `json:"projectId"`
}

type Area struct {
	Id     string `json:"id"`
	Name   string `json:"name"`
	StartX int    `json:"startX"`
	StartY int    `json:"startY"`
	EndX   int    `json:"endX"`
	EndY   int    `json:"endY"`
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
