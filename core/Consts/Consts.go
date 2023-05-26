package consts

import "textualize/entities"

// type Language struct {
// 	DisplayName   string
// 	ProcessCode   string
// 	TranslateCode string
// }

func GetSuppportedLanguages() []entities.Language {
	return []entities.Language{
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
