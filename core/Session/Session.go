package session

type session struct {
	Project      Project
	Organization Organization
	User         User
}

var sessionInstance *session

func GetInstance() *session {
	if sessionInstance == nil {
		sessionInstance = &session{}
	}
	return sessionInstance
}

func InitializeModule(newSession session) *session {
	sessionInstance = &newSession
	return sessionInstance
}
