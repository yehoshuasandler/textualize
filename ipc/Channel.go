package ipc

import (
	document "textualize/core/Document"
	"textualize/translate"
)

type Channel struct{}

var channelInstance *Channel

func GetInstance() *Channel {
	if channelInstance == nil {
		channelInstance = &Channel{}
	}

	return channelInstance
}

func (c *Channel) RequestTranslateArea(areaId string) bool {
	documentOfArea := document.GetDocumentCollection().GetDocumentByAreaId(areaId)
	area := documentOfArea.GetAreaById(areaId)
	processedArea := document.GetProcessedAreaCollection().GetAreaById(area.Id)

	var textToTranslate string
	for _, line := range processedArea.Lines {
		for _, word := range line.Words {
			textToTranslate = textToTranslate + " " + word.FullText
		}
	}

	var sourceLanguage string
	if area.Language.TranslateCode != "" {
		sourceLanguage = area.Language.TranslateCode
	} else if documentOfArea.DefaultLanguage.TranslateCode != "" {
		sourceLanguage = documentOfArea.DefaultLanguage.TranslateCode
	} else {
		return false
	}

	sourceLanguage = "he"
	targetLanguage := "en"
	translatedText := translate.Text(textToTranslate, sourceLanguage, targetLanguage)
	if translatedText == "" {
		return true
	} else {
		return false
	}
}
