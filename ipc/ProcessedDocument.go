package ipc

import (
	"sort"
	document "textualize/core/Document"
	"textualize/entities"

	"github.com/google/uuid"
)

func (c *Channel) GetProcessedAreasByDocumentId(id string) []entities.ProcessedArea {
	areas := document.GetProcessedAreaCollection().GetAreasByDocumentId(id)

	areaCount := len(areas)
	readableAreas := make([]entities.ProcessedArea, areaCount)
	for i := 0; i < areaCount; i++ {
		readableAreas[i] = entities.ProcessedArea(*areas[i])
	}

	sortedAreas := readableAreas
	sort.Slice(sortedAreas, func(i, j int) bool {
		return sortedAreas[i].Order < sortedAreas[j].Order
	})

	return sortedAreas
}

func (c *Channel) RequestAddProcessedArea(processedArea entities.ProcessedArea) entities.ProcessedArea {

	for lineIndex, line := range processedArea.Lines {
		for wordIndex, word := range line.Words {
			if word.Id == "" {
				processedArea.Lines[lineIndex].Words[wordIndex].Id = uuid.NewString()
			}
		}
	}

	document.GetProcessedAreaCollection().AddProcessedArea(processedArea)
	return processedArea
}

func (c *Channel) RequestUpdateProcessedWordById(wordId string, newTextValue string) bool {
	areas := document.GetProcessedAreaCollection().Areas

	var areaOfWordIndex int = -1
	var lineOfWordIndex int = -1
	var foundWordIndex int = -1
	for areaIndex, area := range areas {

		for lineIndex, line := range area.Lines {

			for wordIndex, word := range line.Words {
				if word.Id == wordId {
					areaOfWordIndex = areaIndex
					lineOfWordIndex = lineIndex
					foundWordIndex = wordIndex
					break
				}
			}

			if foundWordIndex >= 0 {
				break
			}
		}

		if foundWordIndex >= 0 {
			break
		}
	}

	if areaOfWordIndex < 0 || lineOfWordIndex < 0 || foundWordIndex < 0 {
		return false
	}

	wordProps := areas[areaOfWordIndex].Lines[lineOfWordIndex].Words[foundWordIndex]
	areas[areaOfWordIndex].Lines[lineOfWordIndex].Words[foundWordIndex] = entities.ProcessedWord{
		Id:          wordProps.Id,
		Direction:   wordProps.Direction,
		FullText:    newTextValue,
		BoundingBox: wordProps.BoundingBox,
	}

	if areas[areaOfWordIndex].Lines[lineOfWordIndex].Words[foundWordIndex].FullText == newTextValue {
		successfulSave := c.RequestSaveDocumentCollection()
		return successfulSave
	} else {
		return false
	}
}
