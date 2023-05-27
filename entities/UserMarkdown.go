package entities

type UserMarkdown struct {
	Id         string `json:"id"`
	DocumentId string `json:"documentId"`
	Value      string `json:"value"`
}

type UserMarkdownCollection struct {
	Values []UserMarkdown `json:"values"`
}
