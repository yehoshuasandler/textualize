package consts

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
