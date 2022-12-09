package app

import (
	"context"
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
}
