package ipc

type Document struct {
	Id        string `json:"id"`
	GroupId   string `json:"groupId"`
	Name      string `json:"name"`
	Path      string `json:"path"`
	ProjectId string `json:"projectId"`
}

type DocumentCollection struct {
	Documents []Document `json:"documents"`
	ProjectId string     `json:"projectId"`
}

type DocumentGroup struct {
	Id        string `json:"id"`
	ParentId  string `json:"parentId"`
	ProjectId string `json:"projectId"`
	Name      string `json:"name"`
}

type DocumentGroupCollection struct {
	Id             string          `json:"id"`
	DocumentGroups []DocumentGroup `json:"groups"`
	ProjectId      string          `json:"projectId"`
}
