package storage

type DocumentCollection struct {
	Documents []Document `json:"documents"`
	ProjectId string     `json:"projectId"`
}

type Document struct {
	Id              string   `json:"id"`
	GroupId         string   `json:"groupId"`
	Name            string   `json:"name"`
	Path            string   `json:"path"`
	ProjectId       string   `json:"projectId"`
	Areas           []Area   `json:"areas"`
	DefaultLanguage Language `json:"defaultLanguage"`
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
