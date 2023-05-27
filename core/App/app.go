package app

import (
	"context"
	"fmt"
	document "textualize/core/Document"
	session "textualize/core/Session"
	"textualize/entities"
	storage "textualize/storage"
)

type App struct {
	Context context.Context
}

var instance *App

func GetInstance() *App {
	if instance == nil {
		instance = &App{}
	}

	return instance
}

func (a *App) Startup(ctx context.Context) {
	a.Context = ctx
	localUserData := storage.GetDriver().ReadUserData()
	session.InitializeModule(session.Session{
		User: entities.User(localUserData),
	})

	document.InitializeModule()

	fmt.Println(localUserData)
}
