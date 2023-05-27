package consts

import "textualize/entities"

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
