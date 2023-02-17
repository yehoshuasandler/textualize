package session

type Session struct {
	Project      Project
	Organization Organization
	User         User
}

var sessionInstance *Session

func GetInstance() *Session {
	if sessionInstance == nil {
		sessionInstance = &Session{}
	}
	return sessionInstance
}

func InitializeModule(newSession Session) *Session {
	if sessionInstance == nil {
		sessionInstance = &newSession
	}
	return sessionInstance
}

func (s *Session) UpdateCurrentUser(updatedUser User) User {
	s.User = User(updatedUser)
	return s.User
}
