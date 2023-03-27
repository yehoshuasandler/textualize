package document

type ProcessedBoundingBox struct {
	X0 int32
	Y0 int32
	X1 int32
	Y1 int32
}

type ProcessedSymbol struct {
	Text        string
	Confidence  float32
	BoundingBox ProcessedBoundingBox
}

type ProcessedWord struct {
	FullText    string
	Symbols     []ProcessedSymbol
	Confidence  float32
	Direction   string
	BoundingBox ProcessedBoundingBox
}

type ProcessedLine struct {
	FullText string
	Words    []ProcessedWord
}

type ProcessedArea struct {
	Id         string
	DocumentId string
	FullText   string
	Order      int
	Lines      []ProcessedLine
}

type ProcessedAreaCollection struct {
	Areas []ProcessedArea
}

var processedAreaCollectionInstnace *ProcessedAreaCollection

func GetProcessedAreaCollection() *ProcessedAreaCollection {
	if processedAreaCollectionInstnace == nil {
		processedAreaCollectionInstnace = &ProcessedAreaCollection{}
	}
	return processedAreaCollectionInstnace
}

func (collection *ProcessedAreaCollection) AddProcessedArea(area ProcessedArea) {
	collection.Areas = append(collection.Areas, area)
}

func (collection *ProcessedAreaCollection) GetAreasByDocumentId(id string) []*ProcessedArea {
	var foundAreas []*ProcessedArea

	for index, a := range collection.Areas {
		if a.DocumentId == id {
			foundAreas = append(foundAreas, &collection.Areas[index])
		}
	}

	return foundAreas
}

func (collection *ProcessedAreaCollection) GetAreaById(areaId string) *ProcessedArea {
	var foundArea *ProcessedArea

	for index, a := range collection.Areas {
		if a.Id == areaId {
			foundArea = &collection.Areas[index]
			break
		}
	}

	return foundArea
}
