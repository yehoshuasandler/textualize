package main

import (
	"embed"
	"log"

	app "textualize/core/App"
	document "textualize/core/Document"
	Channel "textualize/ipc"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed frontend/out frontend/out/_next/static/*/* frontend/out/_next/static/*/*/*
var assets embed.FS

//go:embed build/appicondark.png
var icon []byte

func main() {
	// Create an instance of the app structure
	app := app.GetInstance()

	document.InitizeModule()
	ipcChannel := Channel.GetInstance()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Textualize",
		Width:     1024,
		Height:    648,
		MinWidth:  1024,
		MinHeight: 600,
		// MaxWidth:  1280,
		// MaxHeight: 800,
		// DisableResize:     false,
		Fullscreen:        false,
		Frameless:         false,
		StartHidden:       false,
		HideWindowOnClose: false,
		BackgroundColour:  &options.RGBA{R: 255, G: 255, B: 255, A: 255},
		Assets:            assets,
		Menu:              nil,
		Logger:            nil,
		LogLevel:          logger.DEBUG,
		OnStartup:         app.Startup,
		// OnDomReady:        app.domReady,
		// OnBeforeClose:     app.beforeClose,
		// OnShutdown:        app.shutdown,
		WindowStartState: options.Normal,
		Bind: []interface{}{
			ipcChannel,
		},
		// Windows platform specific options
		Windows: &windows.Options{
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			DisableWindowIcon:    false,
			// DisableFramelessWindowDecorations: false,
			WebviewUserDataPath: "",
		},
		// Mac platform specific options
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: false,
				HideTitle:                  false,
				HideTitleBar:               false,
				FullSizeContent:            false,
				UseToolbar:                 false,
				HideToolbarSeparator:       false,
			},
			Appearance:           mac.NSAppearanceNameDarkAqua,
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			About: &mac.AboutInfo{
				Title:   "Textualize",
				Message: "",
				Icon:    icon,
			},
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
