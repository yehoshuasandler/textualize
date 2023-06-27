package consts

import "textualize/entities"

func GetSupportedLanguages() []entities.Language {
	return []entities.Language{
		{
			DisplayName:     "English",
			ProcessCode:     "eng",
			TranslateCode:   "en",
			IsBundledCustom: false,
		},
		{
			DisplayName:     "Hebrew - Classic",
			ProcessCode:     "heb",
			TranslateCode:   "he",
			IsBundledCustom: false,
		},
		{
			DisplayName:     "Hebrew - Rashi",
			ProcessCode:     "heb_rashi",
			TranslateCode:   "he",
			IsBundledCustom: true,
		},
	}
}
