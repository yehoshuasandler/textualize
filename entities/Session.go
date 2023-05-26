package entities

type Session struct {
	Project      Project      `json:"project"`
	Organization Organization `json:"organization"`
	User         User         `json:"user"`
}
