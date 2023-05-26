package document

import "textualize/entities"

type ProcessedBoundingBox entities.ProcessedBoundingBox

type ProcessedSymbol entities.ProcessedSymbol

type ProcessedWord entities.ProcessedWord

type ProcessedLine entities.ProcessedLine

type ProcessedArea entities.ProcessedArea

type ProcessedAreaCollection struct {
	Areas []entities.ProcessedArea
}

var processedAreaCollectionInstnace *ProcessedAreaCollection

func GetProcessedAreaCollection() *ProcessedAreaCollection {
	if processedAreaCollectionInstnace == nil {
		processedAreaCollectionInstnace = &ProcessedAreaCollection{}
	}
	return processedAreaCollectionInstnace
}

func SetProcessedAreaCollection(collection ProcessedAreaCollection) {
	processedAreaCollectionInstnace = &collection
}

func (collection *ProcessedAreaCollection) AddProcessedArea(area entities.ProcessedArea) {
	collection.Areas = append(collection.Areas, area)
}

func (collection *ProcessedAreaCollection) GetAreasByDocumentId(id string) []*entities.ProcessedArea {
	var foundAreas []*entities.ProcessedArea

	for index, a := range collection.Areas {
		if a.DocumentId == id {
			foundAreas = append(foundAreas, &collection.Areas[index])
		}
	}

	return foundAreas
}

func (collection *ProcessedAreaCollection) GetAreaById(areaId string) *entities.ProcessedArea {
	var foundArea *entities.ProcessedArea

	for index, a := range collection.Areas {
		if a.Id == areaId {
			foundArea = &collection.Areas[index]
			break
		}
	}

	return foundArea
}
