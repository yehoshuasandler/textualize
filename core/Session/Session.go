package session

import "textualize/entities"

type Session entities.Session

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

func (s *Session) UpdateCurrentUser(updatedUser entities.User) entities.User {
	s.User = entities.User(updatedUser)
	return s.User
}
