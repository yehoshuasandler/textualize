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

type Language struct {
	DisplayName   string
	ProcessCode   string
	TranslateCode string
}

func GetSuppportedLanguages() []Language {
	return []Language{
		{
			DisplayName:   "English",
			ProcessCode:   "eng",
			TranslateCode: "en",
		},
		{
			DisplayName:   "Hebrew",
			ProcessCode:   "heb",
			TranslateCode: "he",
		},
	}
}
