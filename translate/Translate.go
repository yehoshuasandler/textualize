package translate

import (
	"fmt"

	"github.com/snakesel/libretranslate"
	// tr "github.com/snakesel/libretranslate"
)

var translatorInstance *libretranslate.Translation

func GetTranslator() *libretranslate.Translation {
	return libretranslate.New(libretranslate.Config{
		Url: "http://localhost:9090",
	})
}

func Text(value string, sourceLanguage string, targetLanguage string) string {
	translator := GetTranslator()

	responseText, err := translator.Translate(value, sourceLanguage, targetLanguage)
	if err == nil {
		fmt.Println(responseText)
		return responseText
	} else {
		fmt.Println(err.Error())
		return ("")
	}
}
