package document

import (
	"textualize/entities"
)

type Entity entities.Document

type Area entities.Area

func (e *Entity) AddArea(a entities.Area) {
	e.Areas = append(e.Areas, a)
}

func (e *Entity) GetAreaById(areaId string) *entities.Area {
	var foundArea *entities.Area

	for index, a := range e.Areas {
		if a.Id == areaId {
			foundArea = &e.Areas[index]
		}
	}
	return foundArea
}
