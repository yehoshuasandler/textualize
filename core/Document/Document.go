package document

import (
	consts "textualize/core/Consts"
)

type Entity struct {
	Id              string
	GroupId         string
	Name            string
	Path            string
	ProjectId       string
	Areas           []Area
	DefaultLanguage consts.Language
}

type Area struct {
	Id       string
	Name     string
	StartX   int
	StartY   int
	EndX     int
	EndY     int
	Language consts.Language
	Order    int
}

func (e *Entity) AddArea(a Area) {
	e.Areas = append(e.Areas, a)
}

func (e *Entity) GetAreaById(areaId string) *Area {
	var foundArea *Area

	for index, a := range e.Areas {
		if a.Id == areaId {
			foundArea = &e.Areas[index]
		}
	}
	return foundArea
}
