package document

type Entity struct {
	Id        string
	GroupId   string
	Name      string
	Path      string
	ProjectId string
	Areas     []Area
}

type Area struct {
	Id     string
	Name   string
	StartX int
	StartY int
	EndX   int
	EndY   int
}

func (e *Entity) AddArea(a Area) {
	e.Areas = append(e.Areas, a)
}
