package session

type Organization struct {
	Id       string
	Name     string
	LogoPath string
	Users    []User
}
