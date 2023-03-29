package storage

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
