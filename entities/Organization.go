package entities

type Organization struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	LogoPath string `json:"logoPath"`
	Users    []User `json:"users"`
}
