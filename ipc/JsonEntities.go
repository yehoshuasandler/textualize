package ipc

type Document struct {
	Id        string `json:"id"`
	GroupId   string `json:"groupId"`
	Name      string `json:"name"`
	Path      string `json:"path"`
	ProjectId string `json:"projectId"`
	Areas     []Area `json:"areas"`
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
