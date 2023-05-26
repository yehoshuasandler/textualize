package entities

type User struct {
	Id         string `json:"id"`
	LocalId    string `json:"localId"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	AvatarPath string `json:"avatarPath"`
	AuthToken  string `json:"authToken"`
	Email      string `json:"email"`
}
